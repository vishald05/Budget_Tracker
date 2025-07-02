const Expense = require('../models/Expense');
const User = require('../models/User');

exports.addExpense = async (req, res) => {
  const { amount, description, date } = req.body;
  try {
    const expense = new Expense({
      userId: req.user,
      amount,
      description,
      date: date || new Date()
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.getExpenses = async (req, res) => {
//   try {
//     const expenses = await Expense.find({ userId: req.user }).sort({ date: -1 });
//     const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
//     const user = await User.findById(req.user);
//     const savings = user.income - totalSpent;

//     res.json({ expenses, income: user.income, savings });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.deleteExpense = async (req, res) => {
  try {
    const exp = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!exp) return res.status(404).json({ msg: "Expense not found" });
    res.json({ msg: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { view, year, month, day } = req.query;
    let filter = { userId: req.user };

    // Apply filters
    if (view === 'day' && year && month && day) {
      const date = new Date(year, month - 1, day);
      const next = new Date(year, month - 1, parseInt(day) + 1);
      filter.date = { $gte: date, $lt: next };
    } else if (view === 'month' && year && month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      filter.date = { $gte: start, $lt: end };
    } else if (view === 'year' && year) {
      const start = new Date(year, 0, 1);
      const end = new Date(parseInt(year) + 1, 0, 1);
      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const user = await User.findById(req.user);
    const savings = user.income - totalSpent;

    res.json({ expenses, savings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
