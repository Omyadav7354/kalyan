import React, { useEffect, useState } from "react";
import axios from "axios";

const ReferralPage = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await axios.get("https://sratebackend-2.onrender.com/feedback"); // Update with your API URL
      setReferrals(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 h-full">
      <h1 className="text-3xl font-bold mb-4">Referral List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone Number</th>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">Referred By</th>
            </tr>
          </thead>
          <tbody>
            {referrals?.map((referral, index) => (
              <tr key={referral._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{referral.name}</td>
                <td className="py-2 px-4 border">{referral.email}</td>
                <td className="py-2 px-4 border">{referral.phoneNumber}</td>
                <td className="py-2 px-4 border">{referral.message}</td>
                <td className="py-2 px-4 border">{referral.referBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralPage;
