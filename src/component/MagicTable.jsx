import React from "react";
import { toast } from "react-toastify";

const MagicEdenTable = ({ data, convertion }) => {
  // Group orders by rune

  const checkForValueBadi = (newData) => {
    let updatedTicker = null;
    console.log(data);

    if (newData.type === "valuebadi") {
      toast.error(
        <>
          <div>Ticker: {newData.runes.orders[0].rune}</div>
          <div>
            Unit Price:{" "}
            {(newData.runes.orders[0].formattedUnitPrice * convertion).toFixed(
              4
            )}
          </div>
        </>
      );
    }
  };

  checkForValueBadi(data);

  const groupedOrders = data.runes.orders.reduce((acc, order) => {
    const rune = order.rune;
    if (!acc[rune]) {
      acc[rune] = [];
    }
    acc[rune].push(order);
    return acc;
  }, {});

  return (
    <div className=" mx-auto p-4 ">
      <h2 className="text-xl font-bold mb-4 text-center">Magic Eden Orders</h2>
      <div className="overflow-x-auto ">
        {Object.keys(groupedOrders).map((rune) => (
          <div key={rune} className="mb-8 ">
            {/* Heading for each group */}
            <h3 className="text-lg font-semibold mb-2 text-gray-700">{rune}</h3>
            {/* Scrollable table container */}
            <div className="max-h-[30vh] overflow-y-auto border border-gray-300 rounded-lg ">
              <table className="table-auto border-collapse w-full text-sm">
                <thead className="sticky top-0 bg-gray-100">
                  <tr className="text-left">
                    <th className="border border-gray-300 px-4 py-2">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Price</th>
                    <th className="border border-gray-300 px-4 py-2">Stats</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Total BTC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedOrders[rune].map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
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
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MagicEdenTable;
