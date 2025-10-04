import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Add from "./pages/Add/Add";
import Menu from "./pages/Menu/Menu";
import Orders from "./pages/Orders/Orders";
import AdminLogin from "./components/AdminLogin";
import { ToastContainer } from 'react-toastify';
import { useModal } from "./components/Modal/useModal";
// import 'react-toastify/dist/ReactToastify.css';
import Settings from "./pages/Settings/Settings";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const url = "http://localhost:4000";
  const  { openModal } = useModal()

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem("adminToken");
    if (token) {
      // You could also validate the token here
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (success) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    openModal({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      onConfirm: () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        setIsAuthenticated(false);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-300 to-emerald-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-300 to-emerald-300">
      <ToastContainer/>
      <Navbar onLogout={handleLogout} />
      
      <div className="mx-4 md:mx-6 lg:mx-8 xl:mx-10 mt-6 md:mt-8 p-4 md:p-6 rounded-3xl bg-white/30 backdrop-blur-md shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Sidebar />
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <Routes>
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/menu" element={<Menu url={url}/>} />
              <Route path="/orders" element={<Orders url={url} />} />
              <Route path="/list" element={<Navigate to="/menu" replace />} />
              <Route path="*" element={<Navigate to="/add" replace />} />
              <Route path="/settings" element={<Settings url={url}/>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;