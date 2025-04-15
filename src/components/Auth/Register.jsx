import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PixelButton from '../UI/PixelButton';
import PixelInput from '../UI/PixelInput';
import PixelDateInput from '../UI/PixelDateInput';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    birth_date: '',
    gender: '',
    address: '',
    password: '',
    confirm_password: '',
    profile_picture: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, profile_picture: e.target.files[0] }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, birth_date: date }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await register(formData);
    setIsLoading(false);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-black">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800 pixel-shadow">Register for Habit Garden</h2>
        
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Username*</label>
            <PixelInput
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email*</label>
            <PixelInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">First Name*</label>
              <PixelInput
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="First name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Last Name*</label>
              <PixelInput
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Last name"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
            <PixelInput
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone number (optional)"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Birth Date</label>
            <PixelDateInput
              value={formData.birth_date ? new Date(formData.birth_date) : null}
              onChange={handleDateChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border-4 border-gray-800 rounded bg-white font-pixel text-lg text-gray-400"
            >
              <option value="">Select gender (optional)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your address (optional)"
              className="w-full px-3 py-2 border-4 border-gray-800 rounded bg-white font-pixel text-lg text-gray-600"
              rows="3"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Profile Picture</label>
            <label 
              htmlFor="profile_picture"
              className="block w-full px-3 py-2 font-pixel text-gray-400 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 border-4 border-gray-800"
            >
              {formData.profile_picture ? `File selected: ${formData.profile_picture.name}` : 'Click to choose a file (optional)'}
            </label>

            <input
              id="profile_picture" 
              type="file"
              name="profile_picture"
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Password*</label>
            <PixelInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Confirm Password*</label>
            <PixelInput
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <PixelButton type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </PixelButton>
            
            <Link to="/login" className="text-green-600 hover:text-green-800 font-bold underline-pixel">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;