const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});