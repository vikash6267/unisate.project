import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import UnisatRequirmentShow from "../component/common/UnisatRequirmentShow";
import { toast } from "react-toastify";
import tone from "../assests/tone.mp3";

function Home() {
  const [data, setData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [toggleShow, setToggleShow] = useState(false);
  const [blinkingTickers, setBlinkingTickers] = useState([]); // New state for blinking
  const audio = useMemo(() => new Audio(tone), []); // Create Audio instance for tone
  const [toggleSound, setToggleSound] = useState(false);

  const firsttime = useMemo(() => "true", []);

  const fetchDataAll = async (firsttime = "false") => {
    try {
      const response = await axios.get(
        `https://crypto.mahitechnocrafts.in/unisat/auctions/${firsttime}`
      );
  
      
      console.log(response);

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
      console.error("Error fetching data:", error);
    }
  };

  // const updateData = async (newData) => {
  //   setData((prevData) => {
  //     return prevData.map((oldItem) => {
  //       const updatedItem = newData.find(
  //         (newItem) => newItem.tick === oldItem.tick
  //       );
  //       if (updatedItem) {
  //         // Calculate the price change percentage
  //         const priceChangePercentage =
  //           ((updatedItem.unitPrice - oldItem.unitPrice) / oldItem.unitPrice) *
  //           100;

  //         // Trigger an alert if the price change is more than 5%
  //         if (Math.abs(priceChangePercentage) > 4) {


  //             if (toggleSound) {
  //             audio.play().catch((err) => {
  //               console.error("Error playing audio:", err);
  //             });
  //           }

  //            axios.post(
  //             "https://crypto.mahitechnocrafts.in/unisat/tbot",
  //             {
  //               message: `
  //                Ticker: ${updatedItem.tick}
  //                 Unit Price: ${updatedItem.unitPrice.toFixed(4)}
  //                 Quantity: ${updatedItem.quantity}
  //                 Total Price: ${updatedItem.totalPrice.toFixed(4)}
  //                 Percentage: Price changed by ${priceChangePercentage.toFixed(2)}%
  //               `
  //             }
  //           );
            
  //           toast.error(
  //             <>
  //               <div>Ticker: {updatedItem.tick}</div>
  //               <div>Unit Price: {updatedItem.unitPrice.toFixed(4)}</div>
  //               <div>Quantity: {updatedItem.quantity}</div>
  //               <div>Total Price: {updatedItem.totalPrice.toFixed(4)}</div>
  //               <div>
  //                 Percantage:{" "}
  //                 {`Price changed by ${priceChangePercentage.toFixed(2)}%`}
  //               </div>
  //             </>
  //           );
  //           // alert(`Price changed by ${priceChangePercentage.toFixed(2)}%.`);
  //         }

  //         // Determine price change type (increase or decrease)
  //         const priceChange =
  //           Number(updatedItem.unitPrice).toFixed(4) >
  //           Number(oldItem.unitPrice).toFixed(4)
  //             ? "increase"
  //             : Number(updatedItem.unitPrice).toFixed(4) <
  //               Number(oldItem.unitPrice).toFixed(4)
  //             ? "decrease"
  //             : null;

  //         // Set color change logic based on price change type
  //         const colorChange =
  //           priceChange === "increase"
  //             ? "green"
  //             : priceChange === "decrease"
  //             ? "red"
  //             : "black";

  //         // Blink the tickers when price changes
  //         if (priceChange) {
          
  //           setBlinkingTickers((prev) => [...prev, updatedItem.tick]); // Start blinking
  //           setTimeout(() => {
  //             setBlinkingTickers((prev) =>
  //               prev.filter((tick) => tick !== updatedItem.tick)
  //             ); // Stop blinking after 3 seconds
  //           }, 3000);
  //         }

  //         return {
  //           ...updatedItem,
  //           priceChange,
  //           color: colorChange, // Add color property for style changes
  //         };
  //       }
  //       return oldItem;
  //     });
  //   });
  // };

  const [notifiedTickers, setNotifiedTickers] = useState({}); // Track network calls by ticker

const updateData = async (newData) => {
  setData((prevData) => {
    return prevData.map((oldItem) => {
      const updatedItem = newData.find(
        (newItem) => newItem.tick === oldItem.tick
      );
      if (updatedItem) {
        // Calculate the price change percentage
        const priceChangePercentage =
          ((updatedItem.unitPrice - oldItem.unitPrice) / oldItem.unitPrice) *
          100;

        // Trigger an alert if the price change is more than 4%
        if (Math.abs(priceChangePercentage) > 4) {
          // Play sound
          if (toggleSound) {
            audio.play().catch((err) => console.error("Error playing audio:", err));
          }

          // Check if a network call has already been made for this ticker
          if (!notifiedTickers[updatedItem.tick]) {
            axios.post(
              "https://crypto.mahitechnocrafts.in/unisat/tbot",
              {
                message: `
                  Ticker: ${updatedItem.tick}
                  Unit Price: ${updatedItem.unitPrice.toFixed(4)}
                  Quantity: ${updatedItem.quantity}
                  Total Price: ${updatedItem.totalPrice.toFixed(4)}
                  Percentage: Price changed by ${priceChangePercentage.toFixed(2)}%
                `,
              }
            );
            // Update the state to mark this ticker's network call as sent
            setNotifiedTickers((prev) => ({
              ...prev,
              [updatedItem.tick]: true,
            }));
          }

          // Show toast notification (UI alert every time)
          toast.error(
            <>
              <div>Ticker: {updatedItem.tick}</div>
              <div>Unit Price: {updatedItem.unitPrice.toFixed(4)}</div>
              <div>Quantity: {updatedItem.quantity}</div>
              <div>Total Price: {updatedItem.totalPrice.toFixed(4)}</div>
              <div>
                Percentage: {`Price changed by ${priceChangePercentage.toFixed(2)}%`}
              </div>
            </>
          );
        }

        // Handle blinking and color change
        const priceChange =
          updatedItem.unitPrice > oldItem.unitPrice
            ? "increase"
            : updatedItem.unitPrice < oldItem.unitPrice
            ? "decrease"
            : null;

        const colorChange =
          priceChange === "increase"
            ? "green"
            : priceChange === "decrease"
            ? "red"
            : "black";

        if (priceChange) {
          setBlinkingTickers((prev) => [...prev, updatedItem.tick]); // Start blinking
          setTimeout(() => {
            setBlinkingTickers((prev) =>
              prev.filter((tick) => tick !== updatedItem.tick)
            );
          }, 3000); // Stop blinking after 3 seconds
        }

        return {
          ...updatedItem,
          priceChange,
          color: colorChange,
        };
      }
      return oldItem;
    });
  });
};

  const checkForValueBadi = (newData) => {
    let updatedTicker = null;
    newData.forEach((item) => {
      if (item.type === "valuebadi") {
        if (!selectedTicker || selectedTicker.tick !== item.tick) {
          if (toggleSound) {
            audio.play().catch((err) => {
              console.error("Error playing audio:", err);
            });
          }
          axios.post(
            "https://crypto.mahitechnocrafts.in/unisat/tbot",
            {
              message: `
               Ticker: ${item.tick}
                Unit Price: ${item.unitPrice.toFixed(4)}
                Quantity: ${item.quantity}
                Total Price: ${item.totalPrice.toFixed(4)}
                `
            }
          );
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
      <main className="flex-1 flex flex-col lg:flex-row gap-6 lg:p-6">
        <div className="flex-1 bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center px-6 py-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-xl font-bold">BRC20</h2>

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
          {Array.isArray(data) && data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="py-3 px-4 text-left">Tick</th>
                    <th className="py-3 px-4 text-left">Unit Price</th>
                    <th className="py-3 px-4 text-left">Quantity</th>
                    <th className="py-3 px-4 text-left">Total Price</th>
                    <th className="py-3 px-4 text-left">Inscription Number</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b hover:bg-gray-50 transition ${
                        item.priceChange === "increase"
                          ? "bg-green-100"
                          : item.priceChange === "decrease"
                          ? "bg-red-100"
                          : ""
                      }`}
                    >
                      <td className="py-3 px-4">{item.tick}</td>
                      <td
                        className={`py-3 px-4 ${
                          item.priceChange === "increase"
                            ? "text-green-600"
                            : item.priceChange === "decrease"
                            ? "text-red-600"
                            : ""
                        } ${
                          blinkingTickers.includes(item.tick) ? "blink" : ""
                        }`}
                      >
                        {(item.unitPrice * item.conversionFactor).toFixed(4) ||
                          "N/A"}
                      </td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">
                        {item.totalPrice.toFixed(4) || "N/A"}
                      </td>
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

        {selectedTicker && (
          <div className="lg:w-1/3 bg-blue-900 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 animate-pulse">
              NOTICE - Selected Ticker: {selectedTicker.tick}
            </h2>
            <p className="mb-2">
              <strong>Quantity:</strong> {selectedTicker.quantity}
            </p>
            <p className="mb-2">
              <strong>Unit Price:</strong> {selectedTicker.unitPrice.toFixed(4)}
            </p>
            <p className="mb-2">
              <strong>Total Price:</strong>{" "}
              {selectedTicker.totalPrice.toFixed(4)}
            </p>
          </div>
        )}
      </main>

      {toggleShow && (
        <UnisatRequirmentShow fetchDataAll={fetchDataAll} forApi={"unisat"} />
      )}
    </div>
  );
}

export default Home;
