const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) return res.status(404).json({ msg: "User not found" });

  res.json({ email: user.email, income: user.income });
};

exports.updateIncome = async (req, res) => {
  const { income } = req.body;
  await User.findByIdAndUpdate(req.user, { income });
  res.json({ msg: "Income updated" });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user);
  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) return res.status(400).json({ msg: "Current password is wrong" });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);
  user.passwordHash = passwordHash;
  await user.save();

  res.json({ msg: "Password changed successfully" });
};
