import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaStore, FaStar, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useAuth();
  const [myBusiness, setMyBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBusiness();
  }, []);

  const fetchMyBusiness = async () => {
    try {
      const res = await axios.get('/api/businesses?owner=' + user?.id);
      if (res.data.businesses.length > 0) {
        setMyBusiness(res.data.businesses[0]);
      }
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Yako</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Jina</p>
              <p className="text-xl font-bold">{user?.name}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaStore className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Barua Pepe</p>
              <p className="text-xl font-bold">{user?.email}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaStar className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Aina ya Akaunti</p>
              <p className="text-xl font-bold capitalize">{user?.role}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaEye className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {myBusiness ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Biashara Yako</h2>
            <div className="space-x-2">
              <Link
                to={`/business/${myBusiness._id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEye className="inline mr-1" /> Tazama
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><strong>Jina:</strong> {myBusiness.name}</p>
              <p className="text-gray-600"><strong>Kategoria:</strong> {myBusiness.category}</p>
              <p className="text-gray-600"><strong>Eneo:</strong> {myBusiness.location}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Ukadiriaji:</strong> {myBusiness.averageRating || 0} ⭐</p>
              <p className="text-gray-600"><strong>Maoni:</strong> {myBusiness.reviewsCount}</p>
              <p className="text-gray-600"><strong>Imetazamwa:</strong> {myBusiness.views} mara</p>
              <p className="text-gray-600">
                <strong>Mpango:</strong> 
                <span className={`ml-2 badge ${
                  myBusiness.subscriptionPlan === 'premium' ? 'badge-premium' :
                  myBusiness.subscriptionPlan === 'featured' ? 'badge-featured' : 'badge-free'
                }`}>
                  {myBusiness.subscriptionPlan.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Hujasajili Biashara</h2>
          <p className="text-gray-600 mb-6">
            Bado hujasajili biashara yako. Anza sasa na upate wateja!
          </p>
          <Link
            to="/add-business"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition inline-block"
          >
            Ongeza Biashara Yako
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
