import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Menu = ({url}) => {
  
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      console.log("Fetching from:", `${url}/api/items`);
      const response = await axios.get(`${url}/api/items`);

      console.log("Response:", response);
      console.log("Response data:", response.data);

      if (response.data) {
        setList(response.data);
      } else {
        toast.error("No data received");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      console.error("Error response:", err.response);
      toast.error("Failed to fetch product list: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.delete(`${url}/api/items/${foodId}`);
      
      if (response.status === 204) {
        toast.success("Item deleted successfully");
        await fetchList();
      } else {
        toast.error("Failed to remove food");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong while removing food!");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <p className="text-xl font-bold mb-4 text-neutral-800">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <p className="text-xl font-bold mb-4 text-neutral-800">All Foods List</p>

      {/* Headings - Hidden on mobile, visible on larger screens */}
      <div className="hidden sm:grid grid-cols-5 gap-4 items-center bg-white rounded-xl shadow-sm p-3 mb-3 font-bold">
        <p>Image</p>
        <p>Name</p>
        <p>Category</p>
        <p>Price</p>
        <p className="text-red-600">Action</p>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No food items found</p>
          <button 
            onClick={fetchList}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      ) : (
        /* Food items */
        list.map((item, index) => (
          <div
            key={item._id || index}
            className="bg-white rounded-xl shadow-sm p-4 mb-4 sm:grid sm:grid-cols-5 sm:gap-4 sm:items-center"
          >
            {/* Mobile Layout - Stacked */}
            <div className="sm:hidden space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl || "/placeholder-image.jpg"}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-800 truncate">{item.name}</p>
                  <p className="text-sm text-neutral-500">{item.category}</p>
                </div>
                <button
                  onClick={() => removeFood(item._id)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer flex-shrink-0"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Price:</span>
                <p className="font-semibold text-neutral-800">₦{item.price}</p>
              </div>
            </div>

            {/* Desktop Layout - Grid */}
            {/* Image */}
            <img
              src={item.imageUrl || "/placeholder-image.jpg"}
              alt={item.name}
              className="hidden sm:block w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
              }}
            />

            {/* Name */}
            <p className="hidden sm:block font-medium text-neutral-800 truncate">{item.name}</p>

            {/* Category */}
            <p className="hidden sm:block text-neutral-500 truncate">{item.category}</p>

            {/* Price */}
            <p className="hidden sm:block font-semibold text-neutral-800">₦{item.price}</p>

            {/* Action */}
            <button
              onClick={() => removeFood(item._id)}
              className="hidden sm:flex w-8 h-8 rounded-full hover:bg-gray-100 items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Menu;