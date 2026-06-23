import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaVerified, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const BusinessCard = ({ business }) => {
  const { _id, name, category, description, location, averageRating, reviewsCount, isVerified, subscriptionPlan, images } = business;

  const getBadge = () => {
    if (isVerified && subscriptionPlan === 'premium') {
      return <span className="badge badge-premium ml-2">PREMIUM</span>;
    }
    if (subscriptionPlan === 'featured') {
      return <span className="badge badge-featured ml-2">FEATURED</span>;
    }
    if (isVerified) {
      return <span className="badge badge-verified ml-2">✓ IMETHIBITISHWA</span>;
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
            <Link to={`/business/${_id}`}>{name}</Link>
            {getBadge()}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{category}</p>
        </div>
        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
          <FaStar className="text-yellow-500 mr-1" />
          <span className="font-bold">{averageRating || 0}</span>
          <span className="text-gray-500 text-sm ml-1">({reviewsCount})</span>
        </div>
      </div>

      <p className="text-gray-600 mt-2 line-clamp-2">{description}</p>

      <div className="flex items-center mt-3 text-sm text-gray-500 space-x-4">
        <span className="flex items-center">
          <FaMapMarkerAlt className="mr-1" />
          {location}
        </span>
        <span className="flex items-center">
          <FaPhone className="mr-1" />
          {business.phone}
        </span>
      </div>

      {images && images.length > 0 && (
        <div className="mt-3 flex space-x-2">
          {images.slice(0, 3).map((img, idx) => (
            <img key={idx} src={img} alt={name} className="w-16 h-16 object-cover rounded" />
          ))}
          {images.length > 3 && (
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
              +{images.length - 3}
            </div>
          )}
        </div>
      )}

      <Link 
        to={`/business/${_id}`} 
        className="inline-block mt-4 text-blue-600 font-semibold hover:text-blue-800 transition"
      >
        Tazama Zaidi →
      </Link>
    </div>
  );
};

export default BusinessCard;
