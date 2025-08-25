import React from "react";
import { Link } from "react-router-dom";

const Header = ({ token, onLogout }) => {
  <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <Link
        to="/"
        className="tex-3x1 font-bold text-gray-800 hover:text-blue-600 transition-colors"
      >
        Blog
      </Link>
      <nav className="flex items-center space-x-4">
        {token ? (
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </div>
  </header>;
};

export default Header;
