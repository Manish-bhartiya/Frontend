import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

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
      const response = await apiconnecter('post','users/signup', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        toast.success('User signed up successfully');
        localStorage.setItem('Users', JSON.stringify(response.data.result));
        // setFormData({ name: '', gmail: '', password: '', file: null });
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
      <div className="bg-gray-800 bg-opacity-90 flex flex-col justify-center p-10 mt-14 rounded-lg shadow-lg" style={{ height: '580px' }}>
        <h2 className="text-center text-4xl font-extrabold text-gray-100">Sign Up</h2>
        <div className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="w-full bg-gray-600 text-gray-100 rounded-md px-3 py-2"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="gmail"
              placeholder="Enter your email"
              required
              className="w-full bg-gray-600 text-gray-100 rounded-md px-3 py-2"
              value={formData.gmail}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full bg-gray-600 text-gray-100 rounded-md px-3 py-2"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="file"
              name="file"
              accept="image/*"
              className="w-full bg-gray-600 text-gray-100 rounded-md px-3 py-2"
              onChange={handleChange}
            />
            {fileError && <p className="text-red-500">{fileError}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white rounded-md px-4 py-2">
              Sign Up
            </button>
            <p className="text-gray-400">
              Already have an account? <Link to="/signin" className="text-indigo-400">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
