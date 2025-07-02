const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  income: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
