import React, { useEffect, useState } from "react";
import axios from "axios";

const Blog = () => {
  useEffect(() => {
    getAllBlogData();
  }, []);
  const [showModal, setShowModal] = useState("");
  const [blogDetail, setBlogDetail] = useState({});
  
  const postBlogdata = () => {
    axios.post("http://localhost:9000/blog", blogDetail).then((res) => {
      alert("Updated Successfully");
    });
  };

  const [allBlogData, setAllBlogData] = useState([]);
  const getAllBlogData = () => {
    axios.get("http://localhost:9000/blog").then(
      (res) => {
        setAllBlogData(res.data);
      },
      (err) => {
        alert(err.message);
      }
    );
  };

  const deleteBlog = (id) => {
    axios.delete(`http://localhost:3000/blog${id}`).then(
      (res) => {
        alert("Blog Deleted!");
        getAllBlogData();
      },
      (err) => alert(err.message)
    );
  };

  const updateBlog = (id)=>{
    axios.put( `http://localhost:9000/blog/${id}`, blogDetail).then(
      (res)=>{alert("Updated Succesfully!"); getAllBlogData(); setShowModal("")},
      (err)=> alert(err.message)
    )
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <button
          onClick={() => setShowModal("Add Blog")}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add New Blog
        </button>
      </div>

     
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "S.No",
                "image",
                "title",
                "description",
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
            {allBlogData.map((i, index) => (
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4">
                  <img className="h-12  w-15 " src={i.images}></img>
                </td>
                <td className="px-6 py-4">{i.title}</td>
                <td className="px-6 py-4">{i.description}</td>
               
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => {
                      setBlogDetail(i);
                      setShowModal("Edit Blog");
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600  "
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlog(i._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal == "Add Blog" ? (
        <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center z-[100] justify-center">
          <div className="bg-white flex flex-col h-[80vh]  rounded-lg p-6 w-[80%] max-w-4xl overflow-scroll">
            <h2 className="text-xl font-bold mb-4">Add Blog Details</h2>

            
            <div className="grid grid-cols-2 gap-4">
              {/* Market Name - Read Only */}
          

              {/* Open Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TITLE
                </label>
                <input
                  onChange={(e) =>
                    setBlogDetail({
                      ...blogDetail,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  images
                </label>
                <div className="flex">
                  <input
                     onChange={(e) =>
                      setBlogDetail({
                        ...blogDetail,
                        images: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  />
                
                </div>
               
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  onChange={(e) =>
                    setBlogDetail({
                      ...blogDetail,
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
                onClick={() => postBlogdata()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {"Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* -----------------------Edit Blog Details------------------------------------------ */}

      {showModal == "Edit Blog" ? (
        <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center z-[100] justify-center">
          <div className="bg-white flex flex-col h-[80vh]  rounded-lg p-6 w-[80%] max-w-4xl overflow-scroll">
            <h2 className="text-xl font-bold mb-4">Edit Blog Details</h2>
          
            
            <div className="grid grid-cols-2 gap-4">
             

              {/* Open Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TITLE
                </label>
                <input
                  value={blogDetail.title}
                  onChange={(e) =>
                    setBlogDetail({
                      ...blogDetail,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              
                
              

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  images
                </label>
                <div className="flex">
                  <input
                   value={blogDetail.images}
                   onChange={(e) =>
                     setBlogDetail({
                       ...blogDetail,
                       images: e.target.value,
                     })}
                    className=" p-2 border rounded-md"
                  />
                
                </div>
              
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  value={blogDetail.description}
                  onChange={(e) =>
                    setBlogDetail({
                      ...blogDetail,
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
                onClick={() => updateBlog(blogDetail._id)}
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

export default Blog;
