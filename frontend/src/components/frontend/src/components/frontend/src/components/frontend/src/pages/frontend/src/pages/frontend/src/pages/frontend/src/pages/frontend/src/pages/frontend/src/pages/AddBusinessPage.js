import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AddBusinessPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    phone: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Fundi Simu', 'Mjenzi', 'Daktari', 'Mpiga Picha',
    'Fundi Umeme', 'Fundi Mabomba', 'Mwalimu', 'Dereva', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/businesses', formData);
      alert('Biashara imeongezwa kikamilifu!');
      navigate('/my-business');
    } catch (error) {
      setError(error.response?.data?.message || 'Imeshindwa kuongeza biashara');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Ongeza Biashara Yako</h1>
        <p className="text-gray-600 mb-6">Jaza maelezo ya biashara yako ili wateja wakupate</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Jina la Biashara *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Kategoria *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Chagua Kategoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Maelezo *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Eleza huduma unazotoa..."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Eneo *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Dar es Salaam, Arusha..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Namba ya Simu *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0712 345 678"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Viungo vya Picha (URL)
            </label>
            <input
              type="text"
              name="images"
              value={formData.images.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                images: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              placeholder="https://example.com/picha1.jpg, https://example.com/picha2.jpg"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">Tenganisha viungo kwa koma</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Inaongeza...' : 'Ongeza Biashara'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBusinessPage;
