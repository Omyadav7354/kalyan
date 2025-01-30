import React, { useEffect, useState } from "react";
import axios from "axios";

const Market = () => {
  useEffect(() => {
    getAllProductData();
  }, []);
  const [showModal, setShowModal] = useState("");
  const [productDetail, setProductDetail] = useState({
    features: [],
    images: [],
  });
  const [feature, setFeature] = useState("");
  const [images, setImages] = useState("");
  const addFeature = () => {
    setProductDetail({
      ...productDetail,
      features: [...productDetail.features, feature],
    });
    setFeature("");
  };
  const removeFeature = (featureIndex) => {
    setProductDetail({
      ...productDetail,
      features: productDetail.features.filter(
        (i, index) => index != featureIndex
      ),
    });
  };
  const addImages = () => {
    setProductDetail({
      ...productDetail,
      images: [...productDetail.images, images],
    });
    setImages("");
  };
  const removeImages = (imagesIndex) => {
    setProductDetail({
      ...productDetail,
      images: productDetail.images.filter((i, index) => index != imagesIndex),
    });
  };

  const postProductdata = () => {
    axios.post("http://localhost:9000/product", productDetail).then((res) => {
      alert("Updated Successfully");
    });
  };

  const [allProductData, setAllProductData] = useState([]);
  const getAllProductData = () => {
    axios.get("http://localhost:9000/product").then(
      (res) => {
        setAllProductData(res.data);
      },
      (err) => {
        alert(err.message);
      }
    );
  };

  const deleteProduct = (id) => {
    axios.delete(`http://localhost:9000/product/${id}`).then(
      (res) => {
        alert("Product Deleted!");
        getAllProductData();
      },
      (err) => alert(err.message)
    );
  };

  const updateProduct = (id) => {
    axios.put(`http://localhost:9000/product/${id}`, productDetail).then(
      (res) => {
        alert("Updated Succesfully!");
        getAllProductData();
        setShowModal("");
      },
      (err) => alert(err.message)
    );
  };

  const [filterTitle, setFilterTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const categories = [...new Set(allProductData.map((i) => i.category))];
  const sortByPriceFn = () => {
    sortPrice == "Asc" ? setSortPrice("Desc") : setSortPrice("Asc");
    let sortedList = allProductData.sort((a, b) =>
      sortPrice == "Asc" ? a.price - b.price : b.price - a.price
    );
    setAllProductData(sortedList);
  };

  const [sortByDiscount, setSortByDiscount] = useState("");
  const sortByDiscountFn = () => {
    sortByDiscount == "Asc"
      ? setSortByDiscount("Desc")
      : setSortByDiscount("Asc");
    let sortedDiscount = allProductData.sort((a, b) =>
      sortByDiscount == "Asc"
        ? a.discount - b.discount
        : b.discount - a.discount
    );
    setAllProductData(sortedDiscount);
  };

  // UI Components
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {JSON.stringify(categories)}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowModal("Add Product")}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add New Product
        </button>
      </div>
      {/* Filter Inputs */}
      <div className="flex space-x-4 mb-6">
        <input
          onChange={(e) => setFilterTitle(e.target.value)}
          type="Product Title"
          name="Product Title"
          placeholder="Filter by Title"
          className="p-2 border border-gray-300 rounded"
        />

        <select
          onChange={(e) => setFilterCategory(e.target.value)}
          name="market"
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Category</option>
          {categories.map((i, index) => (
            <option value={i} key={index}>
              {i}
            </option>
          ))}
        </select>

        <button
          onClick={() => sortByPriceFn()}
          className="px-4 py-2 bg-blue-500 hover:bg-red-500 text-white rounded"
        >
          Sort by Price ({sortPrice})
        </button>

        <button onClick={()=>sortByDiscountFn()} className="bg-green-400 rounded-md">
          <label className="mx-2">Filter By Discount ({sortByDiscount})</label>
        </button>
      </div>

      {/* Market Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "S.No",
                "Image",
                "Title",
                "Category",
                "Price",
                "Discount(%)",
                "discounted Price",
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
            {allProductData
              .filter(
                (i) =>
                  i.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
                  i.category.includes(filterCategory)
              )
              .map((i, index) => (
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4">
                    <img className="h-12  w-15 " src={i.images[0]}></img>
                  </td>
                  <td className="px-6 py-4">{i.title}</td>
                  <td className="px-6 py-4">{i.category}</td>
                  <td className="px-6 py-4">₹{i.price}</td>
                  <td className="px-6 py-4">{i.discount}%</td>
                  <td className="px-6 py-4">
                    ₹{Math.floor((i.price * i.discount) / 100)}
                  </td>

                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => {
                        setProductDetail(i);
                        setShowModal("Edit Product");
                      }}
                      className="bg-red-600 text-white hover:bg-blue-500 h-8 w-[90px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(i._id)}
                      className="bg-red-600 text-white hover:bg-blue-500 h-8 w-[90px]"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
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
                <input
                  type="text"
                  onChange={(e) =>
                    setProductDetail({
                      ...productDetail,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md 0"
                />
              </div>

              {/* Open Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TITLE
                </label>
                <input
                  onChange={(e) =>
                    setProductDetail({
                      ...productDetail,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Close Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  onChange={(e) =>
                    setProductDetail({
                      ...productDetail,
                      price: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount(%)
                </label>
                <input
                  onChange={(e) =>
                    setProductDetail({
                      ...productDetail,
                      discount: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features - {feature}
                </label>
                <div className="flex">
                  <input
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    onClick={() => addFeature()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                <ul>
                  {productDetail.features.map((i, index) => (
                    <div className=" flex justify-between mt-2 ">
                      <label>{i}</label>
                      <button
                        className=" h-[3vh] w-[9%] bg-blue-500 flex items-center justify-center  rounded-lg text-[white]"
                        onClick={() => removeFeature(index)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </ul>
              </div>

              {/* images */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  images
                </label>
                <div className="flex">
                  <input
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    onClick={() => addImages()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                <ul>
                  {productDetail.images.map((i, index) => (
                    <div className=" flex justify-between mt-1 ">
                      <img className=" h-12 w-12 " src={i}></img>
                      <button
                        className=" h-[3vh] w-[9%] bg-blue-500  flex items-center justify-center rounded-lg text-[white]"
                        onClick={() => removeImages(index)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  onChange={(e) =>
                    setProductDetail({
                      ...productDetail,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowModal("")}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => postProductdata()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
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
            {JSON.stringify(productDetail)}

            <div className="grid grid-cols-2 gap-4">
              {/* Market Name - Read Only */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  value={productDetail.category}
                  type="text"
                  onChange={(e) =>
                    setProductDetail({
                      ...productDetail,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md 0"
                />
              </div>

              {/* Open Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TITLE
                </label>
                <input
                  value={productDetail.title}
                  onChange={(e) =>
                    setProductDetail({
                      ...productDetail,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Close Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  value={productDetail.price}
                  onChange={(e) =>
                    setProductDetail({
                      ...productDetail,
                      price: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount(%)
                </label>
                <input
                  value={productDetail.discount}
                  onChange={(e) =>
                    setProductDetail({
                      ...productDetail,
                      discount: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features - {feature}
                </label>
                <div className="flex">
                  <input
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    onClick={() => addFeature()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                <ul>
                  {productDetail.features.map((i, index) => (
                    <li className="flex w-[63%] mt-2 justify-between">
                      <label>{i}</label>
                      <button
                        className="h-[3vh] w-[9%] bg-blue-500  flex items-center justify-center rounded-lg text-[white]"
                        onClick={() => removeFeature(index)}
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* images */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  images
                </label>
                <div className="flex">
                  <input
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                    className=" p-2 border rounded-md"
                  />
                  <button
                    onClick={() => addImages()}
                    className="px-4 py-2 bg-blue-500  text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                <ul>
                  {productDetail.images.map((i, index) => (
                    <li className="flex w-[40%] mt-2 justify-between">
                      <img className="h-10 w-10" src={i} />
                      <button
                        className="h-[3vh] w-[15%] flex items-center justify-center bg-blue-500   rounded-lg text-[white]"
                        onClick={() => removeImages(index)}
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  value={productDetail.description}
                  onChange={(e) =>
                    setProductDetail({
                      ...productDetail,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowModal("")}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => updateProduct(productDetail._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {"Update"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Market;
