# Full-Stack Budget Tracker

This is a MERN-style budget tracker application using React, Node.js, Express, and Firebase.

## Prerequisites

- Node.js (v18+)
- A Firebase Project (for Auth and Firestore)

## Features

- **Authentication**: Sign Up / Login with Email (Firebase Auth)
- **Transactions**: Add Income and Expenses
- **Dashboard**: View Balance, Transaction History, and Charts
- **Filtering**: View data by category (Pie Chart)

## Setup Instructions

### 1. Firebase Setup
1.  Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  Enable **Authentication** (Email/Password provider).
3.  Enable **Firestore Database** (Start in Test Mode).
4.  Generate a **Service Account Key**:
    - Project Settings > Service Accounts > Generate new private key.
    - Save the file as `serviceAccountKey.json` inside `server/config/`.
5.  Get **Web App Config**:
    - Project Settings > General > Your apps > Web app.
    - Copy the `firebaseConfig` object.

### 2. Backend Setup
1.  Navigate to `server` folder:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Add your `serviceAccountKey.json` to `server/config/`.
4.  Create a `.env` file in `server/` (optional, for port):
    ```env
    PORT=5000
    ```
5.  Start the server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
1.  Navigate to `client` folder:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Update `client/src/firebase.js` with your Firebase Web Config.
4.  Start the client:
    ```bash
    npm run dev
    ```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design documentation.
