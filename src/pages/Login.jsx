import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ checkLoginStatus }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in when the component mounts
    checkLoginStatus();
  }, [checkLoginStatus]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email === 'crypto@gmail.com' && password === '123456') {
      // Store login data in localStorage for 24 hours
      const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now

      const loginData = { email, password, expiry: expiryTime };
      localStorage.setItem('loginData', JSON.stringify(loginData));

      alert('Login successful!');
      checkLoginStatus(); // Re-check login status after login
      navigate('/'); // Redirect to the home page after successful login
    } else {
      alert('Invalid email or password!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">Don't have an account? <a href="#" className="text-indigo-600 hover:underline">Sign up</a></p>
      </div>
    </div>
  );
};

export default Login;
