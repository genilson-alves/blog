import React from "react";

const Footer = () => {
  <footer className="bg-gray-800 text-white mt-12">
    <div className="container mx-auto px-4 py-6 text-center">
      <p>&copy; {new Date().getFullYear()} Blog. All Rights Reserved.</p>
      <div className="flex justify-center space-x-6 mt-4">
        <a href="#" className="hover:text-blue-400">
          About
        </a>
        <a href="#" className="hover:text-blue-400">
          Contact
        </a>
        <a href="#" className="hover:text-blue-400">
          Privacy Policy
        </a>
      </div>
    </div>
  </footer>;
};

export default Footer;
