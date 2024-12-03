const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use(cors());
// Default requirements


app.use("/unisat",require("./routes/unisatRoutes"))
app.use("/magic",require("./routes/magicRoutes"))

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Periodic check (optional, can be removed if not needed)

console.log("Backend service is running...");


app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});