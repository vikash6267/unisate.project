import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UnisatRequirmentShow from "../component/common/UnisatRequirmentShow";
import tone from "../assests/tone.mp3"

const App = () => {
  const [allData, setAllData] = useState([]);
  const [convertion, setConvertion] = useState(0);
  const [toggleShow, setToggleShow] = useState(false);
  const audio = new Audio(tone); // Create Audio instance for tone

  const fetchData = async (firsttime = "false") => {
    try {
      const response = await axios.get(
        `https://crypto.mahitechnocrafts.in/magic/magic-eden/${firsttime}`
      );
      setAllData(response.data);
      response.data.forEach((item) => {
        checkForValueBadi(item);
      });
      setConvertion(response.data[0]?.conversionFactor || convertion);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkForValueBadi = (newData) => {
    if (newData.type === "valuebadi") {
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
      toast.error(
        <>
          <div>Ticker: {newData.runes.orders[0].rune}</div>
          <div>
            Unit Price:
            {(newData.runes.orders[0].formattedUnitPrice * convertion).toFixed(4)}
          </div>
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
  }, []);

  // Grouping first 2 orders for each rune
  const groupedOrders = allData
    .flatMap((dataset) => dataset.runes.orders)
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
          <button onClick={() => setToggleShow(!toggleShow)}>
            {toggleShow ? "Hide" : "Show"}
          </button>
        </div>
        {Object.keys(groupedOrders).length > 0 ? (
          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="table-auto border-collapse w-full text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-left">
                  <th className="border border-gray-300 px-4 py-2">Rune</th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                  <th className="border border-gray-300 px-4 py-2">Sats</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Total BTC
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedOrders).map(([rune, orders], index) => (
                  <React.Fragment key={index}>
                    <tr className="hover:bg-gray-50">
                      <td
                        className="border border-gray-300 px-4 py-2 font-bold"
                        rowSpan={orders.length + 1} // Merge cells for rune
                      >
                        {rune}
                      </td>
                    </tr>
                    {orders.map((order, subIndex) => (
                      <tr key={subIndex} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {Number(order.formattedAmount).toFixed(5)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {(order.formattedUnitPrice * convertion).toFixed(4)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
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
        ) : (
          <p className="text-gray-600 text-center mt-4">
            No Magic Eden data available.
          </p>
        )}
      </div>

      {toggleShow && (
        <UnisatRequirmentShow fetchDataAll={fetch} forApi={"magic"} />
      )}
    </div>
  );
};

export default App;
