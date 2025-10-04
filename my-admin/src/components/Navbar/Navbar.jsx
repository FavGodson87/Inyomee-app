// components/Navbar/Navbar.jsx
import React from "react";
import { assets } from "../../assets/assets";

const Navbar = ({ onLogout }) => {
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  return (
    <div className="flex flex-col px-6 sm:px-12 py-4 sm:py-6">
      <div className="flex items-center justify-between">
        <img src={assets.inyo} alt="Logo" className="w-[120px] sm:w-[150px] h-auto" />
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{adminUser.name}</p>
            <p className="text-xs text-gray-500">{adminUser.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;