// src/components/Header.jsx

import React from "react";
import { Link } from "react-router-dom";

const Header = ({ token, onLogout }) => (
  <header className="bg-white shadow-md sticky top-0 z-10">
    <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Blog
      </Link>
      <div>
        {token ? (
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        ) : (
          <div className="space-x-2">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 font-semibold py-2 px-4"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  </header>
);

export default Header;
