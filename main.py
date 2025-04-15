from fastapi import FastAPI, HTTPException, Depends, Form, File, UploadFile, Body
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from models import User, Habit, PyObjectId, UserResponse
from database import users_collection, habits_collection
from bson import ObjectId
from passlib.context import CryptContext
from datetime import datetime, timedelta, date
from jose import JWTError, jwt
from typing import Optional, List
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# security
SECRET_KET = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def validate_passwords_math(password: str, confirm_password: str):
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encodeed_jwt = jwt.encode(to_encode, SECRET_KET, algorithm=ALGORITHM)
    return encodeed_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    return user

# routes
@app.post("/register", response_model=UserResponse)
async def register(
        username: str = Form(...),
        email: str = Form(...),
        first_name: str = Form(...),
        last_name: str = Form(...),
        phone_number: Optional[str] = Form(None),
        birth_date: Optional[date] = Form(None),
        gender: Optional[str] = Form(None),
        address: Optional[str] = Form(None),
        profile_picture: Optional[UploadFile] = File(None),
        password: str = Form(...),
        confirm_password: str = Form(...)
    ):
    # password check
    validate_passwords_math(password, confirm_password)

    # email check
    existing_user = await users_collection.find_one(({"email": email}))
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # username check
    existing_username = await users_collection.find_one({"username": username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # manage profile pic
    profile_picture_url = None
    if profile_picture:
        profile_picture_url = f"/static/profiles/{profile_picture.filename}"

    hashed_password = get_password_hash(password)

    # create user
    new_user = {
        "username": username, 
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "phone_number": phone_number,
        "birth_date": birth_date.isoformat() if birth_date else None,
        "gender": gender,
        "address": address,
        "profile_picture": profile_picture_url,
        "password_hash": hashed_password,
    }
    # save to db
    result = await users_collection.insert_one(new_user)
    
    user_response = UserResponse(
        _id = str(result.inserted_id),
        username = username,
        email = email,
        first_name = first_name,
        last_name = last_name,
        phone_number = phone_number,
        birth_date = birth_date.isoformat() if birth_date else None,
        gender = gender,
        address = address,
        profile_picture = profile_picture_url,
    )
    
    return user_response

@app.post("/login")
async def login(
        identifier:str = Body(...), 
        password:str = Body(...)
    ):

    if "@" in identifier:
        user = await users_collection.find_one({"email": identifier})
    else :
        user = await users_collection.find_one({"username": identifier})

    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect identifier or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(user["_id"])}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/user", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return {
        "_id": str(current_user["_id"]),
        "username": current_user["username"],
        "email": current_user["email"],
        "first_name": current_user["first_name"],
        "last_name": current_user["last_name"],
        "phone_number": current_user.get("phone_number"),
        "birth_date": current_user.get("birth_date"),
        "gender": current_user.get("gender"),
        "address": current_user.get("address"),
        "profile_picture": current_user.get("profile_picture"),
    }

@app.post("/habits", response_model=Habit)
async def create_habit(
    name:str = Body(...), 
    description: Optional[str] = Body(None), 
    current_user: dict = Depends(get_current_user)
):
    habit_data = {
        "user_id": ObjectId(current_user["_id"]),
        "name": name,
        "description": description,
        "water_level": 0,
        "is_active": True,
    }
    result = await habits_collection.insert_one(habit_data)
    
    habit_data["_id"] = str(result.inserted_id)
    habit_data["user_id"] = str(habit_data["user_id"])

    return habit_data

@app.patch("/habits/{habit_id}")
async def update_habit(
    habit_id: str,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    is_active: Optional[bool] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    """Update a habit"""
    habit = await habits_collection.find_one({
        "_id": ObjectId(habit_id),
        "user_id": ObjectId(current_user["_id"])
    })

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    update_data = {}
    if name is not None:
        update_data["name"] = name
    if description is not None:
        update_data["description"] = description
    if is_active is not None:
        update_data["is_active"] = is_active

    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    await habits_collection.update_one(
        {"_id": ObjectId(habit_id)},
        {"$set": update_data}
    )

    updated_habit = await habits_collection.find_one({"_id": ObjectId(habit_id)})
    updated_habit["_id"] = str(updated_habit["_id"])
    updated_habit["user_id"] = str(updated_habit["user_id"])

    return updated_habit

@app.delete("/habits/{habit_id}")
async def delete_habit(habit_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a habit"""
    habit = await habits_collection.find_one({
        "_id": ObjectId(habit_id),
        "user_id": ObjectId(current_user["_id"])
    })

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    await habits_collection.delete_one({"_id": ObjectId(habit_id)})

    return {"message": "Habit deleted successfully"}

@app.post("/habits/{habit_id}/water")
async def water_habit(habit_id:str, current_user: dict = Depends(get_current_user)):
    """Water a habit (add water level)"""
    habit = await habits_collection.find_one({"_id": ObjectId(habit_id), "user_id": ObjectId(current_user["_id"])})
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    updated_water_level = habit["water_level"] + 1
    current_time = datetime.utcnow()

    await habits_collection.update_one(
        {"_id": ObjectId(habit_id)},
        {
            "$set": {
                "water_level": updated_water_level,
                "last_watered_date": current_time
            },
            "$push": {
                "watering_history": {
                    "date": current_time,
                    "water_level": updated_water_level
                }
            }
        }
    )

    return {
        "message": "Water added!",
        "water_level": updated_water_level,
        "last_watered_date": current_time
    }

@app.get("/habits", response_model=List[Habit])
async def list_habits(current_user: dict = Depends(get_current_user)):
    habits = await habits_collection.find({"user_id": ObjectId(current_user["_id"])}).to_list(100)

    for habit in habits:
        habit["_id"] = str(habit["_id"])
        habit["user_id"] = str(habit["user_id"])
    return habits

@app.get("/habits/stats")
async def get_habits_stats(current_user: dict = Depends(get_current_user)):
    """Get statistics about user habits"""
    active_habits = await habits_collection.count_documents({
        "user_id": ObjectId(current_user["_id"]),
        "is_active": True
    })

    total_habits = await habits_collection.count_documents({
        "user_id": ObjectId(current_user["_id"])
    })

    habits = await habits_collection.find({
        "user_id": ObjectId(current_user["_id"])
    }).to_list(100)

    total_water = sum(habit.get("water_level", 0) for habit in habits)

    habits_sorted = sorted(habits, key=lambda x: x.get("water_level", 0), reverse=True)
    best_habit = habits_sorted[0] if habits_sorted else None

    if best_habit:
        best_habit["_id"] = str(best_habit["_id"])
        best_habit["user_id"] = str(best_habit["user_id"])

    return {
        "active_habits": active_habits,
        "total_habits": total_habits,
        "total_water": total_water,
        "best_habit": best_habit
    }

@app.put("/habits/{habit_id}/status")
async def update_habit_status(
    habit_id: str,
    is_active: bool = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """Update a habit's active status"""
    habit = await habits_collection.find_one({
        "_id": ObjectId(habit_id),
        "user_id": ObjectId(current_user["_id"])
    })

    if not habit :
        raise HTTPException(status_code=404, detail="Habit not found")
    
    await habits_collection.update_one(
        {"_id": ObjectId(habit_id)},
        {"$set": {"is_active": is_active}}
    )

    updated_habit = await habits_collection.find_one({"_id": ObjectId(habit_id)})
    updated_habit["_id"] = str(updated_habit["_id"])
    updated_habit["user_id"] = str(updated_habit["user_id"])

    return updated_habit

@app.get("/habits/{habit_id}/history")
async def get_habit_history(
    habit_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get watering history for a specific habit"""
    habit = await habits_collection.find_one({
        "_id": ObjectId(habit_id),
        "user_id": ObjectId(current_user["_id"])
    })

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    history = habit.get("watering_history", [])

    # format dates for frontend
    for entry in history:
        if "date" in entry:
            entry["date"] = entry["date"].isoformat()

    return {
        "habit_id": str(habit["_id"]),
        "habit_name": habit["name"],
        "history": history
    }