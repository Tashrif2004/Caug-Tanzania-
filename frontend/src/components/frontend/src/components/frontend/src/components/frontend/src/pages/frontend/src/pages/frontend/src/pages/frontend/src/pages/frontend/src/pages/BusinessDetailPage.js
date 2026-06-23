import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaPhone, FaMapMarkerAlt, FaVerified, FaUser } from 'react-icons/fa';

const BusinessDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      const res = await axios.get(`/api/businesses/${id}`);
      setBusiness(res.data.business);
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error('Error fetching business:', error);
      if (error.response?.status === 404) {
        navigate('/not-found');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post(`/api/businesses/${id}/reviews`, reviewData);
      await fetchBusinessDetails();
      setReviewData({ rating: 5, comment: '' });
      alert('Maoni yamewekwa kikamilifu!');
    } catch (error) {
      setError(error.response?.data?.message || 'Imeshindwa kuweka maoni');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (!business) return <div className="text-center py-12">Biashara haipatikani</div>;

  const getPlanBadge = () => {
    if (business.isVerified && business.subscriptionPlan === 'premium') {
      return <span className="badge badge-premium ml-2">PREMIUM</span>;
    }
    if (business.subscriptionPlan === 'featured') {
      return <span className="badge badge-featured ml-2">FEATURED</span>;
    }
    if (business.isVerified) {
      return <span className="badge badge-verified ml-2">✓ IMETHIBITISHWA</span>;
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Business Info */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{business.name}</h1>
                <div className="flex items-center mt-2 flex-wrap gap-2">
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {business.category}
                  </span>
                  {getPlanBadge()}
                </div>
              </div>
              <div className="flex items-center bg-yellow-100 px-3 py-2 rounded-lg">
                <FaStar className="text-yellow-500 text-xl mr-1" />
                <span className="text-2xl font-bold">{business.averageRating || 0}</span>
                <span className="text-gray-500 ml-1">({business.reviewsCount} maoni)</span>
              </div>
            </div>

            <p className="text-gray-700 mt-4 text-lg">{business.description}</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-3 text-blue-500" />
                <span>{business.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaPhone className="mr-3 text-blue-500" />
                <a href={`tel:${business.phone}`} className="hover:text-blue-600">
                  {business.phone}
                </a>
              </div>
              {business.owner && (
                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-3 text-blue-500" />
                  <span>Mwenye Biashara: {business.owner.name}</span>
                </div>
              )}
            </div>

            {business.images && business.images.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-3">
                {business.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${business.name} - ${idx + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4">Maoni ya Wateja</h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500">Hakuna maoni bado. Kuwa wa kwanza kuandika!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{review.user?.name || 'Mtumiaji'}</p>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('sw-TZ')}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Write Review Form */}
            {isAuthenticated && (
              <form onSubmit={handleReviewSubmit} className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Andika Maoni Yako</h3>
                {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3">{error}</div>}
                <div className="mb-3">
                  <label className="block text-gray-700 font-medium mb-1">Ukadiriaji</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setReviewData({ ...reviewData, rating: num })}
                        className={`text-2xl ${num <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    placeholder="Andika maoni yako hapa..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Inatuma...' : 'Tuma Maoni'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column - Contact & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-4">Wasiliana</h3>
            <a
              href={`tel:${business.phone}`}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 mb-3"
            >
              <FaPhone /> Piga Simu
            </a>
            <a
              href={`https://wa.me/${business.phone.replace(/\s/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              WhatsApp
            </a>

            {business.isVerified && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <FaVerified className="text-green-500 text-xl" />
                <span className="text-green-700 font-semibold">Biashara Imethibitishwa</span>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
              <p>Imewasilishwa: {new Date(business.createdAt).toLocaleDateString('sw-TZ')}</p>
              <p>Imetazamwa: {business.views} mara</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
