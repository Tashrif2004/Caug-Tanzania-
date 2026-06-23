import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BusinessListPage from './pages/BusinessListPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import AddBusinessPage from './pages/AddBusinessPage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="spinner"></div>;
  
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }
  
  return children;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/businesses" element={<BusinessListPage />} />
          <Route path="/search" element={<BusinessListPage />} />
          <Route path="/business/:id" element={<BusinessDetailPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/add-business" element={
            <ProtectedRoute>
              <AddBusinessPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
