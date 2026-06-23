import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BusinessCard from '../components/BusinessCard';

const BusinessListPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minRating: ''
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    fetchBusinesses();
  }, [currentPage, searchQuery, filters]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...(searchQuery && { q: searchQuery }),
        ...(filters.category && { category: filters.category }),
        ...(filters.location && { location: filters.location }),
        ...(filters.minRating && { minRating: filters.minRating })
      };

      const res = await axios.get('/api/businesses', { params });
      setBusinesses(res.data.businesses);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  if (loading && businesses.length === 0) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {searchQuery ? `Matokeo ya "${searchQuery}"` : 'Biashara Zote'}
      </h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-8 grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Kategoria Zote</option>
            <option value="Fundi Simu">Fundi Simu</option>
            <option value="Mjenzi">Mjenzi</option>
            <option value="Daktari">Daktari</option>
            <option value="Mpiga Picha">Mpiga Picha</option>
            <option value="Fundi Umeme">Fundi Umeme</option>
            <option value="Fundi Mabomba">Fundi Mabomba</option>
            <option value="Mwalimu">Mwalimu</option>
            <option value="Dereva">Dereva</option>
            <option value="Other">Nyingine</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Eneo</label>
          <input
            type="text"
            name="location"
            placeholder="Dar es Salaam, Arusha..."
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kiwango cha Chini</label>
          <select
            name="minRating"
            value={filters.minRating}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Nyota Zote</option>
            <option value="4">4+ Nyota</option>
            <option value="3">3+ Nyota</option>
            <option value="2">2+ Nyota</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {businesses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Hakuna biashara zilizopatikana</p>
          <p className="text-gray-500">Jaribu kubadilisha vigezo vya utafutaji</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business._id} business={business} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
              >
                &laquo;
              </button>
              <span className="px-4 py-2">
                Ukurasa {currentPage} wa {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusinessListPage;
