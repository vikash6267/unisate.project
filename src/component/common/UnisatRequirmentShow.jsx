import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UnisatRequirmentShow({fetchDataAll}) {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequirement, setNewRequirement] = useState({
    key: '',
    value: '',
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/api/requirements');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequirement({
      ...newRequirement,
      [name]: value,
    });
  };

  const handleAddRequirement = async () => {
    try {
      // Format `value`, set to null if empty or undefined
      const formattedRequirement = {
        ...newRequirement,
        value: newRequirement.value
          ? newRequirement.value.startsWith('$')
            ? newRequirement.value
            : `$${newRequirement.value}`
          : null, // Set null if value is empty
      };
  
      // Send the formatted data to the API
      await axios.post('http://localhost:3005/api/requirements', formattedRequirement);
  
      // Refresh the data and reset modal
      fetchData();
      fetchDataAll("true");
      setIsModalOpen(false);
      setNewRequirement({ key: '', value: '' });
    } catch (error) {
      console.error('Error adding new requirement:', error.message);
    }
  };
  
  
  

  const handleDeleteRequirement = async (key) => {
    try {
      await axios.delete(`http://localhost:3005/api/requirements/${key}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting requirement:', error.message);
    }
  };

  useEffect(() => {

    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-white shadow rounded-lg space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          BRC20 Requirement Show
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New Requirement
        </button>
      </div>
      {data ? (
        <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4">Key</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(data).map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-800">{key}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {value ? value : 'No Available'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteRequirement(key)}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-4">Loading requirements...</p>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-sm sm:max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              Add New Requirement
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600" htmlFor="key">
                  Key
                </label>
                <input
                  type="text"
                  id="key"
                  name="key"
                  value={newRequirement.key}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter key"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600" htmlFor="value">
                  Value
                </label>
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={newRequirement.value}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter value"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRequirement}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Add Requirement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnisatRequirmentShow;
