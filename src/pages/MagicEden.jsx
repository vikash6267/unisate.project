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
  const [toggleSound, setToggleSound] = useState(true);

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
  const handleComparison = (orders, rune) => {
    if (orders.length >= 2) {
      const firstOrder = orders[0];
      const secondOrder = orders[1];

      const firstPrice = firstOrder.formattedUnitPrice;
      const secondPrice = secondOrder.formattedUnitPrice;


      if(parseFloat(secondPrice).toFixed(2) !== parseFloat(firstPrice).toFixed(2) ){
        setBlinkingRow(rune); // Set the rune for blinking
        setTimeout(() => setBlinkingRow(null), 3000); // Stop blinking after 3 seconds

      }
      // Calculate percentage difference
      const percentageChange = ((secondPrice - firstPrice) / firstPrice) * 100;

      // Check if the change is greater than or equal to ±5%
      if (Math.abs(percentageChange) >= 5) {
        // Play tone
        if (toggleSound) {
          audio
            .play()
            .catch((err) => console.error("Error playing audio:", err));
        }

        // Highlight the row
        setBlinkingRow(rune); // Set the rune for blinking
        setTimeout(() => setBlinkingRow(null), 3000); // Stop blinking after 3 seconds

        // Show toast notification
        toast.info(
          <>
            <div>Ticker: {rune || "N/A"}</div>
            <div>First Price: {(firstPrice * convertion).toFixed(4)}</div>
            <div>Second Price: {(secondPrice * convertion).toFixed(4)}</div>
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
    // Check for price changes after fetching data
    allData.forEach((dataset) => {
      const rune = dataset?.runes?.orders?.[0]?.rune;
      if (rune) {
        handleComparison(dataset.runes.orders, rune);
      }
    });
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
        <div className="flex justify-around">
          <h2 className="text-xl font-bold mb-4">Magic Eden Data</h2>
          <button
            onClick={() => setToggleShow(!toggleShow)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {toggleShow ? "Hide" : "Show"}
          </button>
          <button onClick={() => setToggleSound(!toggleSound)}>
            {toggleSound ? "Mute" : "Unmute"}
          </button>
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
                      <td
                       className="border border-gray-300 px-4 py-2"
                      >
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
