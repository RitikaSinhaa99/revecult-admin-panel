const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes'); // correct name

const app = express();
//added admin routes to access
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/mydb")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
