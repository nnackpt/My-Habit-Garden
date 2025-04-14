from pydantic import BaseModel, Field, GetJsonSchemaHandler, EmailStr
from typing import Optional, Any, List
from bson import ObjectId
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import CoreSchema, core_schema
from datetime import date, datetime

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler: GetJsonSchemaHandler) -> CoreSchema:
        return core_schema.no_info_after_validator_function(cls.validate, handler(str))

    @classmethod
    def validate(cls, value: str) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)
    
    @classmethod
    def __get_pydantic_json_schema__(cls, schema: CoreSchema, handler: GetJsonSchemaHandler) -> JsonSchemaValue:
        json_schema = handler(schema)
        json_schema.update(type="string", example="65a3b4c5d6e7f8g9h0i1j2k3")
        return json_schema
    
class WateringHistory(BaseModel):
    date: datetime
    water_level: int

class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    profile_picture: Optional[str] = None
    password_hash: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserResponse(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    profile_picture: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Habit(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId
    name: str
    description: Optional[str] = None
    water_level: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_waterd_date: Optional[datetime] = None
    watering_history: List[WateringHistory] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}