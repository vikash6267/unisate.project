import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import MagicEdenTable from "../component/MagicTable";
import UnisatRequirmentShow from "../component/common/UnisatRequirmentShow";

const App = () => {
  const [allData, setAllData] = useState([]);
  const [convertion, setConvertion] = useState(0);

  // Memoize firsttime to ensure it's the same value throughout the component lifecycle
  const firsttime = useMemo(() => "true", []);

  // Fetch data with default 'firsttime' value
  const fetchData = async (firsttime = "false") => {
    try {
      const response = await axios.get(
        `http://localhost:3005/magic/magic-eden/${firsttime}`
      );
      setAllData(response.data); // Assuming response.data is an array of datasets
      setConvertion(response.data[0].conversionFactor);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Call fetchData with the initial 'firsttime' value
    fetchData(firsttime);

    // Set interval to fetch data every 6 seconds
    const interval = setInterval(() => {
      fetchData("false"); // Always pass "false" for subsequent calls
    }, 6000);

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [firsttime]); // Dependency array ensures effect runs when 'firsttime' changes

  if (allData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
     <div className="grid lg:grid-cols-3">
      
      {allData.map((dataset, index) => (
        <div key={index} >
          <MagicEdenTable data={dataset} convertion={convertion} />
        </div>
      ))}
     </div>
      <UnisatRequirmentShow fetchDataAll={fetchData} forApi={"magic"} />
    </div>
  );
};

export default App;
