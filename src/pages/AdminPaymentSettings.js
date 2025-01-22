import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPaymentSettings = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    qrImage: '',
    upiId: '',
    paymentPhoneNumber: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      bankName: ''
    },
    announcement: {
      message: '',
      isActive: true
    },
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get('https://sratebackend-1.onrender.com/api/payment-details');
      console.log('Fetched data:', response.data);
      if (response.data) {
        setPaymentDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
        setPaymentDetails(prev => ({
          ...prev,
          qrImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Submitting data:', paymentDetails);
      
      // Check if we have existing data
      const checkResponse = await axios.get('https://sratebackend-1.onrender.com/api/payment-details');
      
      if (checkResponse.data && checkResponse.data._id) {
        // Update existing data
        console.log('Updating existing data with ID:', checkResponse.data._id);
        const updateResponse = await axios.put(
          `https://sratebackend-1.onrender.com/api/payment-details/${checkResponse.data._id}`,
          paymentDetails
        );
        console.log('Update response:', updateResponse.data);
      } else {
        // Create new data
        console.log('Creating new data');
        const createResponse = await axios.post(
          'https://sratebackend-1.onrender.com/api/payment-details',
          paymentDetails
        );
        console.log('Create response:', createResponse.data);
      }
      
      alert('Payment settings updated successfully!');
      fetchPaymentDetails(); // Refresh data
    } catch (error) {
      console.error('Detailed error:', error.response || error);
      alert(`Error: ${error.response?.data?.message || error.message || 'Failed to update settings'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Payment Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* QR Code Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">QR Code</h2>
          <div className="flex items-center space-x-4">
            {(selectedFile || paymentDetails.qrImage) && (
              <img 
                src={selectedFile || paymentDetails.qrImage} 
                alt="QR Code" 
                className="w-48 h-48 object-contain border rounded-lg"
              />
            )}
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>
        </div>

        {/* UPI Details */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">UPI Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">UPI ID</label>
              <input
                type="text"
                value={paymentDetails.upiId}
                onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Phone Number</label>
              <input
                type="text"
                value={paymentDetails.paymentPhoneNumber}
                onChange={(e) => setPaymentDetails({...paymentDetails, paymentPhoneNumber: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                value={paymentDetails.bankDetails.accountNumber}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  bankDetails: {...paymentDetails.bankDetails, accountNumber: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
              <input
                type="text"
                value={paymentDetails.bankDetails.ifscCode}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  bankDetails: {...paymentDetails.bankDetails, ifscCode: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
              <input
                type="text"
                value={paymentDetails.bankDetails.accountHolderName}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  bankDetails: {...paymentDetails.bankDetails, accountHolderName: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                value={paymentDetails.bankDetails.bankName}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  bankDetails: {...paymentDetails.bankDetails, bankName: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Announcement */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Announcement</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={paymentDetails.announcement.message}
              onChange={(e) => setPaymentDetails({
                ...paymentDetails,
                announcement: {...paymentDetails.announcement, message: e.target.value}
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={paymentDetails.announcement.isActive}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  announcement: {...paymentDetails.announcement, isActive: e.target.checked}
                })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Announcement</span>
            </label>
          </div>
        </div>
        {/* Contact Enquiry */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Chat and Call Support Number</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Enter Number</label>
            <input
            
            type='number'
              value={paymentDetails?.contactEnquiry?.message}
              onChange={(e) => setPaymentDetails({
                ...paymentDetails,
                contactEnquiry: {...paymentDetails.contactEnquiry, message: e.target.value}
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></input>
          </div>
          
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Updating...' : 'Update Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPaymentSettings;