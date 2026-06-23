import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">CAUGU</span>
            <span className="text-xs bg-yellow-500 text-gray-800 px-2 py-1 rounded-full">
              Tanzania
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Tafuta biashara, huduma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button type="submit" className="bg-yellow-500 px-4 rounded-r-lg hover:bg-yellow-600 transition">
              <FaSearch className="text-gray-800" />
            </button>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/businesses" className="hover:text-yellow-300 transition">
              Biashara
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="hover:text-yellow-300 transition">
                  <FaUser className="inline mr-1" />
                  {user?.name}
                </Link>
                {user?.role === 'business_owner' ? (
                  <Link to="/my-business" className="bg-yellow-500 text-gray-800 px-3 py-1 rounded-lg hover:bg-yellow-600 transition">
                    Biashara Yangu
                  </Link>
                ) : (
                  <Link to="/add-business" className="bg-yellow-500 text-gray-800 px-3 py-1 rounded-lg hover:bg-yellow-600 transition">
                    Ongeza Biashara
                  </Link>
                )}
                <button onClick={handleLogout} className="hover:text-yellow-300 transition">
                  Toka
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <Link to="/login" className="hover:text-yellow-300 transition">
                  Ingia
                </Link>
                <Link to="/register" className="bg-yellow-500 text-gray-800 px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                  Jiandikisha
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-2xl hover:text-yellow-300 transition"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Tafuta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
              />
              <button type="submit" className="bg-yellow-500 px-4 rounded-r-lg hover:bg-yellow-600 transition">
                <FaSearch className="text-gray-800" />
              </button>
            </form>

            <Link to="/businesses" className="block hover:text-yellow-300 transition" onClick={() => setIsMenuOpen(false)}>
              Biashara
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block hover:text-yellow-300 transition" onClick={() => setIsMenuOpen(false)}>
                  <FaUser className="inline mr-2" />
                  {user?.name}
                </Link>
                <Link to="/my-business" className="block bg-yellow-500 text-gray-800 px-3 py-2 rounded-lg text-center hover:bg-yellow-600 transition" onClick={() => setIsMenuOpen(false)}>
                  Biashara Yangu
                </Link>
                <button onClick={handleLogout} className="block w-full text-left hover:text-yellow-300 transition">
                  Toka
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-yellow-300 transition" onClick={() => setIsMenuOpen(false)}>
                  Ingia
                </Link>
                <Link to="/register" className="block bg-yellow-500 text-gray-800 px-4 py-2 rounded-lg text-center hover:bg-yellow-600 transition" onClick={() => setIsMenuOpen(false)}>
                  Jiandikisha
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
