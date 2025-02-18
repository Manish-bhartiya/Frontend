import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiconnecter } from '../services/apiconnecter';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    gmail: '',
    password: '',
    file: null,
  });

  const [fileError, setFileError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const selectedFile = files[0];
      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          setFileError('File size should be less than 5MB');
        } else if (!selectedFile.type.startsWith('image/')) {
          setFileError('Only image files are allowed');
        } else {
          setFileError('');
          setFormData({ ...formData, file: selectedFile });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.gmail)) {
      toast.error('Invalid email address');
      return;
    }

    if (fileError) {
      toast.error(fileError);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('gmail', formData.gmail);
    data.append('password', formData.password);
    if (formData.file) {
      data.append('file', formData.file);
    }

    try {
      const response = await apiconnecter('POST', 'users/signup', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        toast.success('User signed up successfully');
        localStorage.setItem('Users', JSON.stringify(response.data.result));
        // Optionally reset the form
        setFormData({ name: '', gmail: '', password: '', file: null });
      } else {
        toast.error(response.data.message || 'Failed to sign up');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during signup');
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 bg-opacity-90 flex flex-col justify-center p-10 mt-14 rounded-lg shadow-lg" style={{ height: '650px' }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-100">Sign Up</h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-700 py-8 px-6 shadow-lg sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    required
                    className="w-full pl-3 pr-4 py-2 rounded-md transition-all duration-300 outline-none bg-gray-600 text-gray-100 placeholder-gray-400 focus:bg-gray-500"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gmail" className="block text-sm font-medium text-gray-400">
                  Gmail Address
                </label>
                <div className="mt-1">
                  <input
                    id="gmail"
                    name="gmail"
                    type="email"
                    placeholder="Enter your gmail"
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
                    placeholder="Enter your password"
                    required
                    className="w-full pl-3 pr-4 py-2 rounded-md transition-all duration-300 outline-none bg-gray-600 text-gray-100 placeholder-gray-400 focus:bg-gray-500"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-400">
                  Profile Picture
                </label>
                <div className="mt-1">
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept="image/*"
                    className="w-full pl-3 pr-4 py-2 rounded-md transition-all duration-300 outline-none bg-gray-600 text-gray-100 placeholder-gray-400 focus:bg-gray-500"
                    onChange={handleChange}
                  />
                </div>
                {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
                >
                  Sign Up
                </button>
              </div>

              <div className="text-sm text-center">
                <p className="flex gap-2 font-medium text-gray-400">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-indigo-400 hover:text-indigo-300">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;