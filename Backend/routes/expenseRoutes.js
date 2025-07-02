const express = require('express');
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expenseController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, addExpense);
router.get('/', auth, getExpenses);
router.delete('/:id', auth, deleteExpense);

module.exports = router;

const generatePDF = require('../utils/pdfGenerator');
router.get('/download', auth, async (req, res) => {
  try {
    const { from, to } = req.query;
    const start = new Date(from);
    const end = new Date(to);
    end.setDate(end.getDate() + 1); // include full "to" day

    const expenses = await Expense.find({
      userId: req.user,
      date: { $gte: start, $lt: end }
    });

    const pdfBuffer = await generatePDF(expenses, from, to);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=expense_report.pdf');
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
