require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/Block-Chain")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/student", require("./routes/StudentLoginRoute"));
app.use("/teacher", require("./routes/TeacherLoginRoute"));
app.use("/student", require("./routes/studentProfileRoutes"));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
