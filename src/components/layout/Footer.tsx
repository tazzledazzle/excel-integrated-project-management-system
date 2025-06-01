import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="flex items-center">
              <svg
                className="h-6 w-6 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="9" y2="15" />
              </svg>
              <span className="ml-2 text-lg font-semibold text-gray-900">ProjectHub</span>
            </Link>
          </div>
          
          <div className="mt-8 md:mt-0 md:order-1">
            <nav className="-mx-4 flex flex-wrap justify-center">
              <div className="px-4 py-2">
                <Link to="/about" className="text-sm leading-6 text-gray-600 hover:text-primary-600">
                  About
                </Link>
              </div>
              <div className="px-4 py-2">
                <Link to="/faq" className="text-sm leading-6 text-gray-600 hover:text-primary-600">
                  FAQ
                </Link>
              </div>
              <div className="px-4 py-2">
                <Link to="/privacy" className="text-sm leading-6 text-gray-600 hover:text-primary-600">
                  Privacy
                </Link>
              </div>
              <div className="px-4 py-2">
                <Link to="/terms" className="text-sm leading-6 text-gray-600 hover:text-primary-600">
                  Terms
                </Link>
              </div>
              <div className="px-4 py-2">
                <Link to="/contact" className="text-sm leading-6 text-gray-600 hover:text-primary-600">
                  Contact
                </Link>
              </div>
            </nav>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-100 pt-8 flex flex-col items-center">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {currentYear} ProjectHub. All rights reserved.
          </p>
          <p className="mt-2 text-center text-xs leading-5 text-gray-500">
            Made with ❤️ for better project management
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;