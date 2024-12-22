import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import tone from "../assests/tone.mp3";
import UnisatRequirmentShow from "../component/common/UnisatRequirmentShow";

const App = () => {
  const [allData, setAllData] = useState([]);
  const [convertion, setConvertion] = useState(0);
  const [blinkingRow, setBlinkingRow] = useState(null); // Track blinking row
  const audio = new Audio(tone);
  const [toggleShow, setToggleShow] = useState(false);
  const [toggleSound, setToggleSound] = useState(false);
  const [previousData, setPreviousData] = useState([]);

  const fetchData = async (firsttime = "false") => {
    try {
      const response = await axios.get(
        `https://crypto.mahitechnocrafts.in/magic/magic-eden/${firsttime}`
      );
      const conversionFactor = response.data[0]?.conversionFactor || 1;
      setConvertion(conversionFactor);
      setAllData(response.data);
      response.data.forEach((item) => {
        checkForValueBadi(item);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleComparison = (orders, rune) => {
  //   if (orders.length >= 2) {
  //     const firstOrder = orders[0];
  //     const secondOrder = orders[1];

  //     const firstPrice = parseFloat(firstOrder.formattedUnitPrice).toFixed(1);
  //     const secondPrice = parseFloat(secondOrder.formattedUnitPrice).toFixed(1);

  //     if (secondPrice !== firstPrice) {
  //       setBlinkingRow(rune); // Set the rune for blinking
  //       setTimeout(() => setBlinkingRow(null), 3000); // Stop blinking after 3 seconds
  //     }

  //     // Calculate percentage difference
  //     const percentageChange = ((secondPrice - firstPrice) / firstPrice) * 100;
    
  //     // Check if the change is greater than or equal to ±5%
  //     if (Math.abs(percentageChange) >= 4) {
  //       // Play tone
  //       if (toggleSound) {
  //         audio
  //           .play()
  //           .catch((err) => console.error("Error playing audio:", err));
  //       }

  //       // Highlight the row
  //       setBlinkingRow(rune); // Set the rune for blinking
  //       setTimeout(() => setBlinkingRow(null), 3000); // Stop blinking after 3 seconds

  //       axios.post(
  //         "https://crypto.mahitechnocrafts.in/unisat/tbot",
  //         {
  //           message: `
  //            Ticker: ${rune || "N/A"}
  //           First Price: ${(firstPrice * convertion).toFixed(4)}
  //           Second Price: ${(secondPrice * convertion).toFixed(4)}
  //           Change: ${percentageChange.toFixed(2)}%
  //           `
  //         }
  //       );

  //       // Show toast notification
  //       toast.info(
  //         <>
  //           <div>Ticker: {rune || "N/A"}</div>
  //           <div>First Price: {(firstPrice * convertion).toFixed(4)}</div>
  //           <div>Second Price: {(secondPrice * convertion).toFixed(4)}</div>
  //           <div>Change: {percentageChange.toFixed(2)}%</div>
  //         </>
  //       );
  //     }
  //   }
  // };


  // Add this state to store the last notified percentage change


  const [notifiedTickers, setNotifiedTickers] = useState({}); // To track tickers with sent network calls

  const handleComparison = (orders, rune) => {
    if (orders.length >= 2) {
      const firstOrder = orders[0];
      const secondOrder = orders[1];
  
      const firstPrice = parseFloat(firstOrder.formattedUnitPrice).toFixed(1);
      const secondPrice = parseFloat(secondOrder.formattedUnitPrice).toFixed(1);
  
      if (secondPrice !== firstPrice) {
        setBlinkingRow(rune); // Set the rune for blinking
        setTimeout(() => setBlinkingRow(null), 3000); // Stop blinking after 3 seconds
      }
  
      // Calculate percentage difference
      const percentageChange = ((secondPrice - firstPrice) / firstPrice) * 100;
  
      // Check if the change is greater than or equal to ±4%
      if (Math.abs(percentageChange) >= 4) {
        // Play tone
        if (toggleSound) {
          audio.play().catch((err) => console.error("Error playing audio:", err));
        }
  
        // Highlight the row
        setBlinkingRow(rune);
        setTimeout(() => setBlinkingRow(null), 3000);
  
        // Check if a network call has already been made for this change
        if (!notifiedTickers[rune]) {
          axios.post(
            "https://crypto.mahitechnocrafts.in/unisat/tbot",
            {
              message: `
                Ticker: ${rune || "N/A"}
                First Sats: ${(firstPrice * convertion).toFixed(4)}
                Second Sats: ${(secondPrice * convertion).toFixed(4)}
                Change: ${percentageChange.toFixed(2)}%
              `,
            }
          );
          // Update the state to mark this ticker's network call as sent
          setNotifiedTickers((prev) => ({ ...prev, [rune]: true }));
        }
  
        // Show toast notification (UI alerts every time)
        toast.info(
          <>
            <div>Ticker: {rune || "N/A"}</div>
            <div>First Sats: {(firstPrice * convertion).toFixed(4)}</div>
            <div>Second Sats: {(secondPrice * convertion).toFixed(4)}</div>
            <div>Change: {percentageChange.toFixed(2)}%</div>
          </>
        );
      }
    }
  };
  

  const checkForValueBadi = (newData) => {
    if (newData.type === "valuebadi") {
      const order = newData.runes.orders[0];
      if (convertion === 0) {
        return null;
      }
      if (!order) return;
      const formattedUnitPrice = order?.formattedUnitPrice || 0;
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
      toast.error(
        <>
          <div>Ticker: {order.rune || "N/A"}</div>
          <div>Unit Price: {(formattedUnitPrice * convertion).toFixed(4)}</div>
        </>
      );
    }
  };
  useEffect(() => {
    fetchData("true");
    const interval = setInterval(() => {
      fetchData("false");
    }, 6000);
    return () => clearInterval(interval);
  }, [convertion]);

  useEffect(() => {
    // Compare current data with previous data
    allData.forEach((dataset, index) => {
      const rune = dataset?.runes?.orders?.[0]?.rune;
      if (rune) {
        const previousOrders = previousData[index]?.runes?.orders || [];
        const currentOrders = dataset.runes.orders;

        if (
          previousOrders.length === 0 ||
          JSON.stringify(previousOrders) !== JSON.stringify(currentOrders)
        ) {
          handleComparison(currentOrders, rune);
        }
      }
    });

    // Update previous data after comparison
    setPreviousData(allData);
  }, [allData]);

  // Group and render rows
  const groupedOrders = (allData || [])
    .flatMap((dataset) => dataset.runes?.orders || [])
    .reduce((acc, order) => {
      if (!acc[order.rune]) {
        acc[order.rune] = [];
      }
      if (acc[order.rune].length < 2) {
        acc[order.rune].push(order);
      }
      return acc;
    }, {});

  return (
    <div>
      <div className="mx-auto p-1 lg:p-6">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-100 rounded-md shadow-md">
          <h2 className="text-xl font-bold">Magic Eden Data</h2>

          <div className="flex space-x-4">
            {/* Show/Hide Button */}
            <button
              onClick={() => setToggleShow(!toggleShow)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {toggleShow ? "Hide" : "Show"}
            </button>

            {/* Mute/Unmute Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setToggleSound(!toggleSound)} // Toggle state
                className={`px-4 py-2 rounded-md text-white font-semibold focus:outline-none transition-all 
          ${
            toggleSound
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
              >
                {toggleSound ? "Mute" : "Unmute"} {/* Dynamic text */}
              </button>
              <p className="text-sm text-gray-600">
                Sound:{" "}
                <span className="font-bold">
                  {toggleSound ? "Enabled" : "Disabled"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          <table className="table-auto border-collapse w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left">
                <th className="border border-gray-300 px-4 py-2">Rune</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Sats</th>
                <th className="border border-gray-300 px-4 py-2">Total BTC</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedOrders).map(([rune, orders], index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td
                      className="border border-gray-300 px-4 py-2 font-bold"
                      rowSpan={orders.length + 1}
                    >
                      {rune}
                    </td>
                  </tr>
                  {orders.map((order, subIndex) => (
                    <tr key={subIndex}>
                      <td className="border border-gray-300 px-4 py-2">
                        {Number(order.formattedAmount).toFixed(5)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {(order.formattedUnitPrice * convertion).toFixed(4)}
                      </td>
                      <td
                        className={
                          blinkingRow === rune
                            ? "blinking border border-gray-300 px-4 py-2" // Apply blinking class
                            : "hover:bg-gray-50 border border-gray-300 px-4 py-2"
                        }
                      >
                        {Number(order.formattedUnitPrice).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {(order.price * convertion).toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {toggleShow && (
        <UnisatRequirmentShow fetchDataAll={fetchData} forApi={"magic"} />
      )}
    </div>
  );
};

export default App;
