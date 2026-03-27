const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock user store with test admin
const users = [
    { username: 'admin', email: 'admin@test.com', password: 'admin123' }
];

app.post('/api/login', (req, res) => {
    const { identifier, password } = req.body;
    const user = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password);
    if (user) {
        res.json({ message: 'Login successful', username: user.username });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    if (users.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    users.push({ username, email, password });
    res.json({ message: 'Registration successful' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
