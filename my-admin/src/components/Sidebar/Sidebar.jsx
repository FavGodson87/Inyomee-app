import React from 'react'
import { BiSolidAlarmAdd } from "react-icons/bi";
import { RiAlignItemBottomFill } from "react-icons/ri";
import { PiCodesandboxLogoFill } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="px-4 sm:px-8 pt-6">
      <div className="flex flex-col md:flex-col gap-4 sm:gap-6">

        <NavLink 
          to="/add" 
          className={({ isActive }) =>
            `flex items-start gap-2 px-3 py-2 rounded-lg transition ${
              isActive 
                ? "bg-green-500 text-white" 
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <BiSolidAlarmAdd className="w-[20px] h-auto" />
          <p className="block md:hidden lg:block hidden:[@media (min-width:641px)_and_(max-width:740px)]:inline">Add items</p>
        </NavLink>

        <NavLink 
          to="/menu" 
          className={({ isActive }) =>
            `flex items-start gap-2 px-3 py-2 rounded-lg transition ${
              isActive 
                ? "bg-green-500 text-white" 
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <RiAlignItemBottomFill className="w-[20px] h-auto" />
          <p className="block md:hidden lg:block hidden:[@media (min-width:641px)_and_(max-width:740px)]:inline">Menu items</p>
        </NavLink>

        <NavLink 
          to="/orders" 
          className={({ isActive }) =>
            `flex items-start gap-2 px-3 py-2 rounded-lg transition ${
              isActive 
                ? "bg-green-500 text-white" 
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <PiCodesandboxLogoFill className="w-[20px] h-auto" />
          <p className="block md:hidden lg:block hidden:[@media (min-width:641px)_and_(max-width:740px)]:inline">Orders</p>
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({ isActive }) =>
            `flex items-start gap-2 px-3 py-2 rounded-lg transition ${
              isActive 
                ? "bg-green-500 text-white" 
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <IoSettingsOutline className="w-[20px] h-auto" />
          <p className="block md:hidden lg:block hidden:[@media (min-width:641px)_and_(max-width:740px)]:inline">Settings</p>
        </NavLink>

      </div>
    </div>
  );
};

export default Sidebar;