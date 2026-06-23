import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">CAUGU</h3>
            <p className="text-sm">
              Tafuta Fundi, Huduma au Biashara Popote Tanzania. 
              Pata wataalamu na biashara za kuaminika.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Viungo</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/businesses" className="hover:text-yellow-400 transition">Biashara</Link></li>
              <li><Link to="/about" className="hover:text-yellow-400 transition">Kuhusu Sisi</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition">Wasiliana Nasi</Link></li>
              <li><Link to="/terms" className="hover:text-yellow-400 transition">Masharti</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Kategoria</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search?category=Fundi Simu" className="hover:text-yellow-400 transition">Fundi Simu</Link></li>
              <li><Link to="/search?category=Mjenzi" className="hover:text-yellow-400 transition">Mjenzi</Link></li>
              <li><Link to="/search?category=Daktari" className="hover:text-yellow-400 transition">Daktari</Link></li>
              <li><Link to="/search?category=Mpiga Picha" className="hover:text-yellow-400 transition">Mpiga Picha</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Fuata Sisi</h4>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="hover:text-yellow-400 transition"><FaFacebook /></a>
              <a href="#" className="hover:text-yellow-400 transition"><FaTwitter /></a>
              <a href="#" className="hover:text-yellow-400 transition"><FaInstagram /></a>
              <a href="#" className="hover:text-yellow-400 transition"><FaYoutube /></a>
            </div>
            <p className="text-sm mt-4">
              © 2026 CAUGU Tanzania. Haki zote zimehifadhiwa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
