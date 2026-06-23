import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BusinessCard from '../components/BusinessCard';
import { FaSearch, FaCheckCircle, FaClock, FaStar } from 'react-icons/fa';

const HomePage = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [latestBusinesses, setLatestBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const [featuredRes, latestRes] = await Promise.all([
          axios.get('/api/businesses?subscription=featured&limit=4'),
          axios.get('/api/businesses?limit=6')
        ]);
        setFeaturedBusinesses(featuredRes.data.businesses);
        setLatestBusinesses(latestRes.data.businesses);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const testimonials = [
    {
      name: 'Grace Mwakyusa',
      role: 'Mteja • Dar es Salaam',
      comment: 'Nilihitaji fundi umeme kwa haraka. Kupitia CAUGU nilimpata fundi ndani ya dakika chache. Huduma ilikuwa bora sana!'
    },
    {
      name: 'John Mallya',
      role: 'Mwenye Biashara • Arusha',
      comment: 'Tangu niweke biashara yangu kwenye CAUGU, wateja wameongezeka zaidi ya asilimia 40. Jukwaa bora la biashara.'
    },
    {
      name: 'Amina Said',
      role: 'Mteja • Mwanza',
      comment: 'Nilitafuta mpiga picha wa harusi. CAUGU ilinisaidia kupata mtaalamu aliyekuwa karibu na bei nzuri.'
    }
  ];

  const categories = [
    'Fundi Simu', 'Mjenzi', 'Daktari', 'Mpiga Picha',
    'Fundi Umeme', 'Fundi Mabomba', 'Mwalimu', 'Dereva'
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Tafuta Fundi, Huduma au Biashara Popote Tanzania
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Pata Wataalamu na Biashara za Kuaminika Tanzania. Fundi simu, mjenzi, dereva, daktari, na zaidi.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Tafuta, e.g., Fundi Simu Dar es Salaam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 rounded-lg text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
            />
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-4 px-8 rounded-lg transition flex items-center justify-center gap-2">
              <FaSearch />
              Tafuta
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            <span className="flex items-center"><FaCheckCircle className="mr-2 text-yellow-400" /> Biashara Zilizothibitishwa</span>
            <span className="flex items-center"><FaClock className="mr-2 text-yellow-400" /> Tafuta kwa Dakika</span>
            <span className="flex items-center"><FaStar className="mr-2 text-yellow-400" /> Reviews za Kweli</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Kategoria Maarufu</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/search?category=${encodeURIComponent(cat)}`}
                className="bg-gray-100 hover:bg-blue-50 p-4 rounded-lg text-center transition border-2 border-transparent hover:border-blue-300"
              >
                <span className="font-semibold text-gray-700">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      {!loading && featuredBusinesses.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Biashara Maarufu</h2>
              <Link to="/businesses" className="text-blue-600 hover:text-blue-800 font-semibold">
                Tazama Zote →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBusinesses.map((business) => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Businesses */}
      {!loading && latestBusinesses.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Biashara Mpya</h2>
              <Link to="/businesses" className="text-blue-600 hover:text-blue-800 font-semibold">
                Tazama Zote →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestBusinesses.map((business) => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Wateja Wanasema Nini?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.comment}"</p>
                <p className="font-bold text-gray-800">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Mfumo wa Bei</h2>
          <p className="text-center text-gray-600 mb-12">Chagua mpango unaofaa biashara yako. Anza bure au ongeza uonekano wako.</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Bure</h3>
              <p className="text-gray-600 mb-4">Kwa biashara ndogo zinazotaka kuonekana</p>
              <p className="text-4xl font-bold text-blue-600 mb-6">0 Tsh<span className="text-base font-normal text-gray-500">/mwaka</span></p>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Orodheshwa kwenye directory</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Maelezo muhimu ya biashara</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Uwezekano wa kupokea simu</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Listing moja</li>
              </ul>
              <Link to="/register" className="block w-full bg-gray-300 text-gray-700 font-bold py-3 rounded-lg text-center hover:bg-gray-400 transition">
                Anza Bure
              </Link>
            </div>

            {/* Featured Plan */}
            <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition border-2 border-yellow-500 relative transform md:scale-105">
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                Maarufu Zaidi
              </span>
              <h3 className="text-2xl font-bold mb-2">Featured</h3>
              <p className="text-gray-600 mb-4">Onekane juu na upate wateja zaidi</p>
              <p className="text-4xl font-bold text-blue-600 mb-6">20,000 Tsh<span className="text-base font-normal text-gray-500">/mwezi</span></p>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Onekane katika Featured Listings</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Picha 10 za biashara</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Mawasiliano ya moja kwa moja</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Analytics za msingi</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Support kwa barua pepe</li>
              </ul>
              <Link to="/register" className="block w-full bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-3 rounded-lg text-center transition">
                Jisajili Sasa
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-gray-600 mb-4">Jukwaa kamili la kukuza biashara yako</p>
              <p className="text-4xl font-bold text-blue-600 mb-6">75,000 Tsh<span className="text-base font-normal text-gray-500">/mwezi</span></p>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Top ranking katika matokeo</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Picha 25 za biashara</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Verified Badge bila malipo</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Analytics za kina</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Priority support 24/7</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Uwezekano wa matangazo</li>
              </ul>
              <Link to="/register" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-center transition">
                Wasiliana Nasi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Je, Unataka Kukuza Biashara Yako?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Jiunge na zaidi ya biashara 10,000 nchini Tanzania. Pata wateja wapya na uonekane zaidi.
          </p>
          <Link to="/register" className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-4 px-8 rounded-lg transition text-lg inline-block">
            Anza Sasa - Ni Bure!
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
