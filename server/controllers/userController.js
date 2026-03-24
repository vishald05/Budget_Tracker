const { db } = require('../config/firebase');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
        // Create minimal user doc if absent
        const newUser = {
            uid: userId,
            email: req.user.email,
            currentBalance: 0.00
        };
        await db.collection('users').doc(userId).set(newUser);
        return res.json(newUser);
    }
    
    // Convert currentBalance to float for calculation if it was string
    const data = userDoc.data();
    data.currentBalance = parseFloat(data.currentBalance) || 0;

    res.json(data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
