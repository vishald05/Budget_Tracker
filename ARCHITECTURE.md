# Budget Tracker Architecture Design

## 1. Tech Stack Selection
- **Frontend**: React (Vite) + Tailwind CSS
  - *Reason*: React is component-based, making it easy to manage the UI for charts, lists, and forms. Tailwind ensures a clean, responsive design.
- **Backend**: Node.js + Express
  - *Reason*: Provides a robust API layer. While Firebase can be used directly from the client, an Express backend allows for centralized business logic, validation, and is easier to extend later.
- **Database**: Firebase Firestore (NoSQL)
  - *Reason*: Flexible schema, real-time capabilities, and seamless integration with Firebase Auth.
- **Authentication**: Firebase Authentication
  - *Reason*: Secure, easy-to-implement handling of users (Sign up/Login).

## 2. Database Schema (Firestore)

Since Firestore is NoSQL, we will avoid rigid tables and use **Collections** and **Documents**.

### Collection: `users`
Documents are indexed by `uid` (from Firebase Auth).
```json
{
  "uid": "user_123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "currentBalance": 1500.00,  // Cached balance for quick display
  "createdAt": "Timestamp"
}
```

### Collection: `expenses`
Stores individual transactions.
```json
{
  "id": "expense_abc123",
  "userId": "user_123",      // Foreign key reference to user
  "amount": 50.00,
  "description": "Grocery shopping",
  "category": "Food",        // e.g., "Food", "Transport", "Utilities"
  "date": "2023-10-27T10:00:00Z",
  "type": "expense",         // "expense" or "income"
  "createdAt": "Timestamp"
}
```
*Note: Income can also be stored here with type="income" or in a separate collection. For simplicity, we can mix them or handle income as a transaction.*

## 3. API Routes (Express Backend)

### Authentication
- `POST /api/auth/verify`: Verifies Firebase token sent from client.

### Users
- `GET /api/users/profile`: Get current user details and balance.
- `PATCH /api/users/balance`: Update balance manually (or auto-updated via triggers).

### Expenses
- `GET /api/expenses`: Get all expenses for the logged-in user.
  - Query params: `?period=daily|weekly|monthly` or `?startDate=...&endDate=...`
- `POST /api/expenses`: Add a new expense.
  - *Logic*: Adds expense doc AND updates `users.currentBalance`.
- `DELETE /api/expenses/:id`: Remove an expense.
  - *Logic*: Removes doc AND reverts `users.currentBalance`.

## 4. Frontend Component Breakdown

```
App
├── AuthProvider (Context for user state)
├── Navbar (Shows Logo & Current Balance)
├── Routes
│   ├── Login / Register Page
│   └── Dashboard (Protected Route)
│       ├── SummaryCards (Income, Expense, Balance)
│       ├── ExpenseForm (Add new transaction)
│       ├── ChartSection
│       │   ├── CategoryPieChart
│       │   └── WeeklyBarChart
│       └── ExpenseList
│           ├── FilterBar (Daily/Weekly/Monthly)
│           └── ExpenseItem
```

## 5. Folder Structure

```
/BudgetTracker
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/            # Axios setup & API calls
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Full page views
│   │   └── utils/          # Formatting helpers (currency, date)
├── server/                 # Express Backend
│   ├── config/             # Firebase Admin config
│   ├── controllers/        # Route logic
│   ├── routes/             # API definition
│   └── middleware/         # Auth verification
```
