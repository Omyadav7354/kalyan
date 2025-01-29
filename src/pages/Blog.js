import React, { useEffect, useState } from "react";
import axios from "axios";

const Blog = () => {
  const [showModal, setShowModal] = useState("");

  const [allBlogData, getAllBlogData] = useState([]);
  const [blogDetail, setBlogDetail] = useState({});

  const postBlogData = () => {
    axios.post("http://localhost:9000/blog", blogDetail).then(
      (res) => {
        alert("Updated Successfully");
      },
      (err) => alert(err.message)
    );
  };

  // UI Components
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Add Blog Details
        </button>
      </div>

      {/* Market Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "S.No",
                "Title",
                "Description",
                "Date",
                "Image",

                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4">
                <img className="h-12  w-15 " src=""></img>
              </td>
              <td className="px-6 py-4 flex gap-2">
                <button className="text-indigo-600 hover:text-indigo-900">
                  Edit
                </button>
                <button className="text-indigo-600 hover:text-indigo-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showModal == "Add Product" ? (
        <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center z-[100] justify-center">
          <div className="bg-white flex flex-col h-[80vh]  rounded-lg p-6 w-[80%] max-w-4xl overflow-scroll">
            <h2 className="text-xl font-bold mb-4">Add Product Details</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Market Name - Read Only */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input type="text" className="w-full p-2 border rounded-md 0" />
              </div>

              {/* Open Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TITLE
                </label>
                <input className="w-full p-2 border rounded-md" />
              </div>

              {/* Close Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input className="w-full p-2 border rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount(%)
                </label>
                <input className="w-full p-2 border rounded-md" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features -
                </label>
                <div className="flex">
                  <input className="w-full p-2 border rounded-md" />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                    Add
                  </button>
                </div>
                <ul></ul>
              </div>

              {/* images */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  images
                </label>
                <div className="flex">
                  <input className="w-full p-2 border rounded-md" />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                    Add
                  </button>
                </div>
                <ul></ul>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input className="w-full p-2 border rounded-md" />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                {"Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {/* -----------------------Edit Product Details------------------------------------------ */}
      {showModal == "Edit Product" ? (
        <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center z-[100] justify-center">
          <div className="bg-white flex flex-col h-[80vh]  rounded-lg p-6 w-[80%] max-w-4xl overflow-scroll">
            <h2 className="text-xl font-bold mb-4">Edit Product Details</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Market Name - Read Only */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input className="w-full p-2 border rounded-md 0" />
              </div>

              {/* Open Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TITLE
                </label>
                <input className="w-full p-2 border rounded-md" />
              </div>

              {/* Close Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input className="w-full p-2 border rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount(%)
                </label>
                <input className="w-full p-2 border rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features -
                </label>
                <div className="flex">
                  <input className="w-full p-2 border rounded-md" />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                    Add
                  </button>
                </div>
                <ul></ul>
              </div>

              {/* images */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  images
                </label>
                <div className="flex">
                  <input className=" p-2 border rounded-md" />
                  <button className="px-4 py-2 bg-blue-500  text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                    Add
                  </button>
                </div>
                <ul></ul>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input className="w-full p-2 border rounded-md" />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                {"Update"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Blog;
