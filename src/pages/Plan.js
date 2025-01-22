import React, { useEffect, useState } from "react";
import axios from 'axios'

const PlanPage = () => {
    useEffect(()=>{getPlanData()}, [])
  // State for holding the plan data
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    planName: "",
    planStartAmount: "",
    planEndAmount: "",
    monthlyReturn: "",
    annualReturn: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  //Post Plan
  const postPlanData = ()=>{
    axios.post("https://sratebackend-2.onrender.com/plan", newPlan).then(()=>{alert("Plan Data Posted Successfully"); getPlanData()})
  }

  //Get Plans Data from Backend
  const [planList, setPlanList] = useState([])
  const getPlanData = ()=>{
    axios.get("https://sratebackend-2.onrender.com/plan").then((res)=> setPlanList(res.data.data))
  }


  

  // Update the plan
  const updatePlan = () => {
    axios.put(`https://sratebackend-2.onrender.com/plan/${editId}`, newPlan).then(()=> {getPlanData();
        setEditId("")
        setNewPlan({
            planName: "",
    planStartAmount: "",
    planEndAmount: "",
    monthlyReturn: "",
    annualReturn: "",
        })
    })
  };

  // Delete a plan
  const deletePlan = (id) => {
    axios.delete(`https://sratebackend-2.onrender.com/plan/${id}`).then(()=> {getPlanData()
        
    })
  };

  return (
    <div className="p-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Investment Plans</h1>

      {/* Form to add or edit plan */}
      <div className="bg-gray-100 p-6 shadow-lg rounded-lg mb-8">
        <h2 className="text-2xl mb-4">{isEditing ? "Edit Plan" : "Add New Plan"}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            className="border p-3 rounded-lg"
            type="text"
            name="name"
            placeholder="Plan Name"
            value={newPlan.planName}
            onChange={(e)=> setNewPlan({...newPlan, planName: e.target.value})}
          />
          <input
            className="border p-3 rounded-lg"
            // type="number"
            name="minValue"
            placeholder="Min Value (e.g., 2000)"
            value={newPlan.planStartAmount}
            onChange={(e)=> setNewPlan({...newPlan, planStartAmount: e.target.value})}
          />
          <input
            className="border p-3 rounded-lg"
            // type="number"
            name="maxValue"
            placeholder="Max Value (e.g., 59,999)"
            value={newPlan.planEndAmount}
            onChange={(e)=> setNewPlan({...newPlan, planEndAmount: e.target.value})}
          />
          <input
            className="border p-3 rounded-lg"
            type="text"
            name="monthlyReturn"
            placeholder="Monthly Return (e.g., 3.16%)"
            value={newPlan.monthlyReturn}
            onChange={(e)=> setNewPlan({...newPlan, monthlyReturn: e.target.value})}
          />
          <input
            className="border p-3 rounded-lg"
            type="text"
            name="annualReturn"
            placeholder="Annual Return (e.g., 38%)"
            value={newPlan.annualReturn}
            onChange={(e)=> setNewPlan({...newPlan, annualReturn: e.target.value})}
          />
        </div>

        <button
          className={`mt-6 px-6 py-3 rounded-lg text-white ${
            isEditing ? "bg-yellow-500" : "bg-blue-500"
          } hover:opacity-90`}
          onClick={editId !== "" ? updatePlan : postPlanData}
        >
          {editId !== "" ? "Update Plan" : "Add Plan"}
        </button>
      </div>

      {/* Plan Listing */}
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl mb-4">All Plans</h2>
        {planList.length > 0 ? (
          <table className="min-w-full bg-gray-100 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-4">Plan Name</th>
                <th className="p-4">Min Value</th>
                <th className="p-4">Max Value</th>
                <th className="p-4">Monthly Return</th>
                <th className="p-4">Annual Return</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {planList?.map((plan, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4">{plan.planName}</td>
                  <td className="p-4">₹ {plan?.planStartAmount?.toLocaleString()}</td>
                  <td className="p-4">₹ {plan?.planEndAmount?.toLocaleString()}</td>
                  <td className="p-4">{plan.monthlyReturn}%</td>
                  <td className="p-4">{plan.annualReturn}%</td>
                  <td className="p-4">
                    <button
                      className="text-blue-500 hover:underline mr-4"
                      onClick={() => {setNewPlan(plan); setEditId(plan._id)}}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => deletePlan(plan._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No plans available. Add some plans to get started!</p>
        )}
      </div>
    </div>
  );
};

export default PlanPage;
