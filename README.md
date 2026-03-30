# 💰 Smart Budget Tracker

A modern, serverless, and highly interactive Budget Tracking application designed to help you monitor your finances, visualize your spending trends, and get personalized financial advice using Artificial Intelligence.

🚀 **Live Demo:** [https://budgettracker-pubj.onrender.com](https://budgettracker-pubj.onrender.com)

## ✨ Features

### 🔐 Authentication & Security
* **User Accounts:** Secure email and password registration/login handled by Firebase.
* **Protected Routes:** Application data is exclusively accessible to authenticated users.
* **Password Recovery:** Built-in "Forgot Password" functionality.
* **Data Privacy:** Users only have access to their own transaction ledgers via Firebase Security Rules.

### 🎨 Global UI & User Experience
* **Dark / Light Mode:** Fully supported custom theme toggler utilizing Tailwind CSS v4, saving your preference directly to local storage.
* **Persistent Navbar:** A unified top navigation bar calculates and displays your **Live Total Income, Total Expense, and Current Balance** across all pages.
* **Clean Navigation:** A dedicated sub-navbar cleanly separates the `Dashboard`, `History`, and `AI Advisor` views.
* **Localization:** All numbers and financial metrics are localized to the **Indian Rupee (₹)**.

### 📊 Dashboard Page
* **Intuitive Entry:** Add new transactions quickly using clean toggle buttons for *Income* or *Expense*.
* **Smart Combobox:** A smart, suggestive datalist to select or type custom categories dynamically.
* **Visual Breakdown:** A real-time **Pie/Donut Chart** that instantly visualizes where your money is going.
* **Recent Activity Feed:** A condensed view showing your 5 latest transactions to keep the dashboard clutter-free.

### 📜 Transaction History Page
* **Detailed Ledger:** View every transaction you've made in a responsive CSS grid table.
* **Advanced Filters:** Easily filter your ledger by:
  * Transaction Type (*All, Income, Expense*)
  * Date Boundaries (*This Month, Last Month, or Custom Date Ranges via interactive calendars*)
* **Dynamic Bar Graphs:** Compare your Income vs. Expenses across time using an interactive Bar Chart. You can group trends by **Day, Week, Month, or Year**.
* **Data Exporting:** Instantly backup your financial data right from your browser:
  * **Export to CSV:** For use in Excel or Google Sheets.
  * **Download JSON:** For developer backups.

### 🤖 AI Financial Advisor
* **Context-Aware Chatbot:** A fully integrated AI Chatbot powered by Google Gemini (Gemini 2.5 Flash).
* **Personalized Advice:** The bot reads your actual transaction history automatically so you can ask highly specific questions like *"Where can I cut down on my expenses?"* or *"How much did I spend on food this month?"*.
* **Rich Text UI:** Responses are cleanly formatted using Markdown, giving you a smooth, WhatsApp/ChatGPT style experience.

---

## 🛠️ Tech Stack

**Frontend Framework:**
* [React](https://react.dev/)
* [Vite](https://vitejs.dev/) (Build tool & Dev server)
* [React Router](https://reactrouter.com/) (Client-side routing)

**Styling & UI:**
* [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first styling framework)
* [Lucide React](https://lucide.dev/) (Beautiful iconography)
* [Recharts](https://recharts.org/) (Interactive data visualizations & graphs)
* `react-markdown` (Formatting AI chatbot responses)

**Backend / Database / BaaS:**
* [Firebase Authentication](https://firebase.google.com/products/auth)
* [Firebase Realtime Database](https://firebase.google.com/products/realtime-database)

**Artificial Intelligence:**
* [Google Generative AI](https://ai.google.dev/) (`@google/generative-ai` SDK using `gemini-2.5-flash`)

---

## 🚀 Getting Started

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-link>
cd BudgetTracker/frontend
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env\` file in the \`frontend\` directory and populate it with your Firebase and Gemini API keys:
\`\`\`env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_DATABASE_URL=your_firebase_db_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_GEMINI_API_KEY=your_google_gemini_api_key
\`\`\`

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
The application will launch locally at \`http://localhost:5173/\` (or similar).
