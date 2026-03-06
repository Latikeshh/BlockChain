require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRoutes = require("./routes/BlockRoutes");
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
// student permission routes - for requesting semester filling permissions
app.use("/student/permission", require("./routes/studPermissionRoutes"));
// student requests for record changes
app.use("/student/request", require("./routes/requestRoutes"));
// teacher request routes - for student requesting teacher to add/modify info
app.use("/student/teacher-request", require("./routes/teacherRequestRoutes"));
app.use("/student/form", require("./routes/formRoutes"));
app.use("/contact", require("./routes/contactRoutes"));
// password reset routes - must be before StudentLoginRoute to avoid conflicts
app.use("/student", require("./routes/passwordResetRoutes"));
app.use("/teacher", require("./routes/TeacherLoginRoute"));
app.use("/teacher", require("./routes/teacherPasswordResetRoutes"));
app.use("/uploads", express.static("uploads"));
//
app.use("/api", studentRoutes);
//
app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
