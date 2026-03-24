const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, deleteExpense } = require('../controllers/expenseController');
const verifyToken = require('../middleware/auth');

// Protect all routes with authentication
router.use(verifyToken);

// GET /api/expenses - Get all expenses for the user
router.get('/', getExpenses);

// POST /api/expenses - Add a new expense
router.post('/', addExpense);

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', deleteExpense);

module.exports = router;
