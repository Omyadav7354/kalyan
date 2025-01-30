import React, { useContext, useEffect, useState } from "react";
import { MyData } from "./Context";
import axios from "axios";

const UserManagement = () => {
  useEffect(() => {
    getUserData();
  }, []);


  const { getAllUserFn } = useContext(MyData);

  


  

  const [allUserData, setAllUserData] = useState([]);
  const getUserData = () => {
    axios.get("http://localhost:9000/users").then(
      (res) => {
        setAllUserData(res.data);
      },
      (err) => {}
    );
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:9000/users/${id}`).then(
      (res) => {
        alert("User Deleted!");
        getUserData();
      },
      (err) => alert(err.message)
    );
  };

  return (
    <div className="p-6 bg-gray-100 h-full">
     
      <h1 className="text-3xl font-bold mb-4">User Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Sr.</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">email</th>
              <th className="py-3 px-4 text-left">number</th>
              <th className="py-3 px-4 text-left">Delete User</th>
            </tr>
          </thead>
          <tbody>
            {allUserData.map((i, index) => (
              <tr className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{index + 1} </td>
                <td className="py-2 px-4 border">{i.name}</td>
                <td className="py-2 px-4 border">{i.email}</td>
                <td className="py-2 px-4 border">{i.mobile}</td>
                <button onClick={()=> deleteUser(i._id)} className="bg-red-600 h-8 w-[90px]">Delete</button>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UserManagement;
