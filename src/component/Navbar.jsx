import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        

        {/* Links */}
        <div className="space-x-4">
          <Link
            to="/" 
            className="text-white hover:text-gray-300 transition duration-200">
            UniSat
          </Link>
          <Link
            to="/magic" 
            className="text-white hover:text-gray-300 transition duration-200">
            Magic Eden
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
