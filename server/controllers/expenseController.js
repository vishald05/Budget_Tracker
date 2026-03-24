const { db } = require('../config/firebase');

// Get expenses with date filtering
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { period, date } = req.query; // period: day, week, month, year. date: reference date (YYYY-MM-DD)

    let query = db.collection('expenses')
      .where('userId', '==', userId);

    // Date Filtering Logic
    if (period) {
        const referenceDate = date ? new Date(date) : new Date();
        referenceDate.setHours(0, 0, 0, 0); // Start of reference day

        let startDate, endDate;

        switch (period) {
            case 'day':
                startDate = new Date(referenceDate);
                endDate = new Date(referenceDate);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'week':
                // Assuming week starts on Sunday (day 0)
                const dayOfWeek = referenceDate.getDay();
                startDate = new Date(referenceDate);
                startDate.setDate(referenceDate.getDate() - dayOfWeek);
                
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'month':
                startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
                endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);
                break;
            case 'year':
                startDate = new Date(referenceDate.getFullYear(), 0, 1);
                endDate = new Date(referenceDate.getFullYear(), 11, 31, 23, 59, 59, 999);
                break;
            default:
                break;
        }

        if (startDate && endDate) {
            query = query
                .where('date', '>=', startDate.toISOString())
                .where('date', '<=', endDate.toISOString());
        }
    }

    const expensesSnapshot = await query.orderBy('date', 'desc').get();

    const expenses = [];
    expensesSnapshot.forEach(doc => {
      expenses.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category, date, type } = req.body;
    const userId = req.user.uid;

    if (!amount || !description || !category || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate future date
    if (new Date(date) > new Date()) {
        return res.status(400).json({ error: 'Date cannot be in the future' });
    }

    const newExpense = {
      userId,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(date).toISOString(), // Store as ISO string
      type: type || 'expense', // 'expense' or 'income'
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('expenses').add(newExpense);

    // TODO: Update user's current balance in 'users' collection atomically
    // This is a simplified version. In a real app, use a transaction.
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
        let currentBalance = userDoc.data().currentBalance || 0;
        if (newExpense.type === 'expense') {
            currentBalance -= newExpense.amount;
        } else {
            currentBalance += newExpense.amount;
        }
        await userRef.update({ currentBalance });
        res.status(201).json({ id: docRef.id, ...newExpense, updatedBalance: currentBalance });
    } else {
        // Create user doc if it doesn't exist (e.g. first interaction)
        let initialBalance = 0;
        if (newExpense.type === 'expense') {
            initialBalance -= newExpense.amount;
        } else {
            initialBalance += newExpense.amount;
        }
        await userRef.set({ 
            uid: userId, 
            email: req.user.email,
            currentBalance: initialBalance 
        });
        res.status(201).json({ id: docRef.id, ...newExpense, updatedBalance: initialBalance });
    }
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const docRef = db.collection('expenses').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (doc.data().userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const expenseData = doc.data();
    await docRef.delete();

    // Revert balance
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
        let currentBalance = userDoc.data().currentBalance || 0;
        if (expenseData.type === 'expense') {
            currentBalance += expenseData.amount; // Add back the expense amount
        } else {
            currentBalance -= expenseData.amount; // Subtract the income amount
        }
        await userRef.update({ currentBalance });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};
