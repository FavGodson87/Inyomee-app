import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Select Category",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/items`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Wraps",
        });
        setImage(null);
        toast.success("Item added successfully!");
      } 
      else {
        toast.error("Failed to add product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-4 px-2 sm:px-4 lg:px-6">
      <form
        className="w-full max-w-2xl rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8"
        onSubmit={onSubmitHandler}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 text-center">
          Add Product
        </h2>

        {/* Upload Image */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl p-3 sm:p-4 bg-white shadow-sm w-full gap-3 sm:gap-4">
          <label
            htmlFor="image"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 cursor-pointer flex items-center justify-center bg-neutral-300 text-white text-lg font-semibold mx-auto sm:mx-0"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Product Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>+</span>
            )}
          </label>

          <div className="flex-1 text-center sm:text-left px-2">
            <p className="text-xs sm:text-sm text-neutral-500">Upload a New Photo</p>
            <p className="text-gray-800 font-medium text-xs sm:text-sm truncate">
              {image ? image.name : "No image selected"}
            </p>
          </div>

          <label
            htmlFor="image"
            className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 transition text-sm sm:text-base text-center"
          >
            Update
          </label>

          <input
            type="file"
            id="image"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
            hidden
          />
        </div>

        {/* Product Name */}
        <div className="flex flex-col">
          <label htmlFor="productName" className="font-medium text-neutral-700 mb-1 text-sm sm:text-base">
            Product Name
          </label>
          <input
            onChange={onChangeHandler}
            value={data.name}
            id="productName"
            type="text"
            name="name"
            placeholder="Enter product name"
            className="rounded-xl px-3 py-2 sm:px-4 sm:py-3 bg-neutral-200 outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Product Description */}
        <div className="flex flex-col">
          <label htmlFor="description" className="font-medium text-neutral-700 mb-1 text-sm sm:text-base">
            Product Description
          </label>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            id="description"
            name="description"
            rows="3"
            placeholder="Write product description"
            required
            className="rounded-xl px-3 py-2 sm:px-4 sm:py-3 bg-neutral-200 outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm sm:text-base resize-vertical min-h-[80px]"
          ></textarea>
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Category */}
          <div className="flex flex-col">
            <label htmlFor="category" className="font-medium text-neutral-700 mb-1 text-sm sm:text-base">
              Product Category
            </label>
            <div className="relative">
              <select
                onChange={onChangeHandler}
                value={data.category}
                id="category"
                name="category"
                className="w-full rounded-xl px-3 py-2 sm:px-4 sm:py-3 bg-neutral-200 outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent appearance-none cursor-pointer text-sm sm:text-base"
              >
                <option value="Select Category">Select Category</option>
                <option value="Wraps">Wraps</option>
                <option value="Pizza">Pizza</option>
                <option value="Burgers">Burgers</option>
                <option value="Snacks">Snacks</option>
                <option value="Pastries">Pastries</option>
                <option value="Sweets">Sweets</option>
                <option value="Breads">Breads</option>
                <option value="Cakes">Cakes</option>
                <option value="Ice Cream">Ice Cream</option>
                <option value="Cookies">Cookies</option>
                <option value="Drinks">Drinks</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 sm:right-4 flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label htmlFor="price" className="font-medium text-neutral-700 mb-1 text-sm sm:text-base">
              Product Price
            </label>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              id="price"
              name="price"
              placeholder="₦845"
              className="rounded-xl px-3 py-2 sm:px-4 sm:py-3 bg-neutral-200 outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-2 sm:pt-4">
          <button
            type="submit"
            className="py-2 sm:py-3 w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition text-sm sm:text-base"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;