import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiconnecter } from '../services/apiconnecter';

const SigninPage = () => {
  const [formData, setFormData] = useState({
    gmail: '',
    password: '',
  });
  const [showLogin, setShowLogin] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiconnecter('post','users/login', formData);

      // const response = await axios.post("http://localhost:4001/api/login",formData);
      
      console.log(response);
      if (response.data) {
        toast.success("User logged in successfully");
        localStorage.setItem("Users", JSON.stringify(response.data.user));
        window.location.reload();
        setShowLogin(false);
      }
    } catch (err) {
      toast.error("Error: " + err.response.data.message);
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 bg-opacity-90 flex flex-col justify-center p-10 mt-14 rounded-lg shadow-lg" style={{ height: '530px' }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-100">Login</h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-700 py-8 px-6 shadow-lg sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="gmail" className="block text-sm font-medium text-gray-400">
                Gmail Address
                </label>
                <div className="mt-1">
                  <input
                    id="gmail"
                    name="gmail"
                    type="email"
                    autoComplete="email"
                    placeholder='Enter your gmail'
                    required
                    className="w-full pl-3 pr-4 py-2 rounded-md transition-all duration-300 outline-none bg-gray-600 text-gray-100 placeholder-gray-400 focus:bg-gray-500"
                    value={formData.gmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder='Enter your password'
                    required
                    className="w-full pl-3 pr-4 py-2 rounded-md transition-all duration-300 outline-none bg-gray-600 text-gray-100 placeholder-gray-400 focus:bg-gray-500"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
                >
                  Login
                </button>
              </div>

              <div className="text-sm text-center">
                <p className="flex gap-2 font-medium text-gray-400">
                  Don't have an account? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300">Sign up</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
