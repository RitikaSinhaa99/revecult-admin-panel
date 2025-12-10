const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  region: { type: String, default: "" },
  pincode: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
