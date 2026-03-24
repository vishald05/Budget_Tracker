const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const DEFAULT_PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const expenseRoutes = require('./routes/expenses');
const userRoutes = require('./routes/users');

app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Budget Tracker API is running');
});

// Start Server with Port Retry Logic
const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(parseInt(port) + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(DEFAULT_PORT);
