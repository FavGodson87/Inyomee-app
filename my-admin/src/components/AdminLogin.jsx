// components/AdminLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/api/admin/login", credentials);
      
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminUser", JSON.stringify(response.data.admin));
        toast.success("Admin login successful!");
        onLogin(true);
      }
    } catch (err) {
      console.error("Admin login error:", err);
      toast.error(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-300 to-emerald-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-600 text-sm mt-2">Access the admin dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="admin@inyomee.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-green-300 transition-colors font-medium"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800 text-center">
            <strong>Default Credentials:</strong><br/>
            Email: admin@inyomee.com<br/>
            Password: admin123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;