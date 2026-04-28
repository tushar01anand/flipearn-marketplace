import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CreateListing from './pages/CreateListing';
import Marketplace from './pages/Marketplace';
import ListingDetails from './pages/ListingDetails';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminDisputes from './pages/AdminDisputes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/disputes" element={<AdminDisputes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;