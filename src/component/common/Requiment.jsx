import React, { useState } from "react";
import axios from "axios";

const RequirementsApp = () => {
  const [tickName, setTickName] = useState("");
  const [value, setValue] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://crypto.mahitechnocrafts.in/api/requirements", {
        tick_name: tickName,
        value: value || null, // Send null if the value is empty
      });
      setResponse(res.data);
    } catch (err) {
      setResponse(err.response?.data || { error: "An error occurred" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Requirements</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tick Name:</label>
          <input
            type="text"
            value={tickName}
            onChange={(e) => setTickName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Value:</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {response && (
        <div style={{ marginTop: "20px" }}>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RequirementsApp;
