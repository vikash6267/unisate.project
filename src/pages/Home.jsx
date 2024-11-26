import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import UnisatRequirmentShow from "../component/common/UnisatRequirmentShow";
import { toast } from "react-toastify";

function Home() {
  const [data, setData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(null);

  const firsttime = useMemo(() => "true", []);

  const fetchDataAll = async (firsttime = "false") => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auctions/${firsttime}`
      );

      if (Array.isArray(response.data)) {
        if (firsttime === "true") {
          setData(response.data);
        } else {
          updateData(response.data);
        }
        checkForValueBadi(response.data);
      } else {
        console.error("Received data is not an array", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const updateData = (newData) => {
    setData((prevData) => {
      const updatedData = prevData.map((oldItem) => {
        const updatedItem = newData.find(
          (newItem) => newItem.tick === oldItem.tick
        );
        return updatedItem ? updatedItem : oldItem;
      });
      return updatedData;
    });
  };

  const checkForValueBadi = (newData) => {
    let updatedTicker = null;
    newData.forEach((item) => {
      if (item.type === "valuebadi") {
        if (!selectedTicker || selectedTicker.tick !== item.tick) {
      // console.log(item.tick +item.unitPrice.toFixed(4) , item.quantity , item.totalPrice)

      toast.error(
        <>
          <div>Ticker: {item.tick}</div>
          <div>Unit Price: {item.unitPrice.toFixed(4)}</div>
          <div>Quantity: {item.quantity}</div>
          <div>Total Price: {item.totalPrice.toFixed(4)}</div>
        </>
      );
          updatedTicker = item;
        }
      }
    });

    if (updatedTicker && updatedTicker.tick !== selectedTicker?.tick) {
      setSelectedTicker(updatedTicker);
    }
  };

  useEffect(() => {
    fetchDataAll(firsttime);

    const intervalId = setInterval(() => {
      fetchDataAll();
    }, 6000);

    return () => clearInterval(intervalId);
  }, [selectedTicker, firsttime]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Page Heading */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">BRC20 Dashboard</h1>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 lg:p-6">
        {/* Table Section */}
        <div className="flex-1 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">BRC20 Data</h2>
          {Array.isArray(data) && data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="py-3 px-4 text-left">Tick</th>
                    <th className="py-3 px-4 text-left">Unit Price</th>
                    <th className="py-3 px-4 text-left">Quantity</th>
                    <th className="py-3 px-4 text-left">Total Price</th>
                    <th className="py-3 px-4 text-left ">Inscription Number</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">{item.tick}</td>
                      <td className="py-3 px-4">{item.unitPrice.toFixed(4) || "N/A"}</td>
                     
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">{item.totalPrice.toFixed(4) || "N/A"}</td>
                      <td className="py-3 px-4">
                        {item.inscriptionNumber || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-4">
              No BRC20 data available.
            </p>
          )}
        </div>

        {/* Selected Ticker Sidebar */}
        {selectedTicker && (
  <div className="lg:w-1/3 bg-blue-900 text-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-4 blinking-text">
      NOTCE - Selected Ticker: {selectedTicker.tick}
    </h2>
    <p className="mb-2">
      <strong>Quantity:</strong> {selectedTicker.quantity}
    </p>
    <p className="mb-2">
      <strong>Unit Price:</strong> {selectedTicker.unitPrice.toFixed(4)}
    </p>
    <p className="mb-2">
      <strong>Total Price:</strong> {selectedTicker.totalPrice.toFixed(4)}
    </p>
 
  </div>
)}

      </main>



      <UnisatRequirmentShow fetchDataAll={fetchDataAll} />
    </div>
  );
}

export default Home;
