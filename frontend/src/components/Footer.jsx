const Footer = () => (
  <footer className="bg-white border-t border-gray-200 mt-12">
    <div className="container mx-auto px-4 py-6 text-center text-gray-500">
      <p>&copy; {new Date().getFullYear()} Blog. All Rights Reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="#" className="hover:text-blue-500">
          About
        </a>
        <a href="#" className="hover:text-blue-500">
          Contact
        </a>
        <a href="#" className="hover:text-blue-500">
          Privacy Policy
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
