import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-amber-900 opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center">
          <Link
            to="/"
            className="text-4xl font-serif font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 inline-block"
          >
            RentEasy
          </Link>
          <p className="text-amber-100 mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
            Discover extraordinary homes and find your perfect stay. 
            Where luxury meets comfort, and every rental becomes a cherished memory.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <Link to="/about" className="text-amber-200 hover:text-white transition-colors text-lg hover:underline decoration-amber-500 underline-offset-4">About</Link>
            <Link to="/services" className="text-amber-200 hover:text-white transition-colors text-lg hover:underline decoration-amber-500 underline-offset-4">Services</Link>
            <Link to="/contact" className="text-amber-200 hover:text-white transition-colors text-lg hover:underline decoration-amber-500 underline-offset-4">Contact</Link>
          </div>
          <div className="mt-10 pt-8 border-t border-amber-800">
            <p className="text-amber-300 text-sm">
              © 2025 RentEasy. Crafted with passion for extraordinary homes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
