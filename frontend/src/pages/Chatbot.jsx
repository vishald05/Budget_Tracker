import React, { useState, useEffect, useRef } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const Chatbot = ({ user }) => {
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Hello! I am your AI Financial Advisor. Ask me anything about your expenses or how to save money!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [transactionData, setTransactionData] = useState([]);
    const messagesEndRef = useRef(null);

    // Auto-scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load recent transaction data on mount
    useEffect(() => {
        if (!user) return;
        const fetchTransactions = async () => {
            const txRef = ref(db, `transactions/${user.uid}`);
            const snapshot = await get(txRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const loaded = Object.values(data).map(tx => ({
                    date: tx.date,
                    type: tx.type,
                    category: tx.category,
                    amount: tx.amount
                }));
                // Sort by new
                loaded.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTransactionData(loaded);
            }
        };
        fetchTransactions();
    }, [user]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            // Build the conversational context map
            const systemPrompt = `
You are an expert AI Financial Advisor. Respond kindly and professionally. 
Format your responses using Markdown. Use bolding and bullet points appropriately.
If the context includes currency, remember the user utilizes Indian Rupee (₹).
Here is the user's raw transaction history as context:
${JSON.stringify(transactionData, null, 2)}
            `;

            // We bundle the prompt instead of using ChatSession structure to quickly enforce immediate system prompt + user msg
            const prompt = systemPrompt + "\n\nUser's prompt: " + userMsg;
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            setMessages(prev => [...prev, { role: 'bot', content: responseText }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'error', content: "Sorry, I encountered an error connecting to the AI." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="chat-shell">
            <div className="chat-head">
                <div><span className="eyebrow">Private guidance</span><h1>AI advisor</h1><p>Grounded in the transactions you’ve recorded.</p></div><Bot color="var(--accent)" size={22} />
            </div>

            <div className="chat-log">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role}`}>
                            <div className="message-icon">
                                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                            </div>
                            <div className="message-bubble">
                                {msg.role === 'user' ? (
                                    <p>{msg.content}</p>
                                ) : (
                                    <div className="prose dark:prose-invert max-w-none text-sm space-y-2">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                )}
                        </div>
                        </div>
                ))}
                {isLoading && (
                    <div className="message">
                        <div className="message-bubble">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span> Thinking…</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div>
                <form onSubmit={handleSend} className="chat-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your spending habits..."
                        className="chat-input"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="primary-button"
                    >
                        <Send size={20} className={`${isLoading ? 'opacity-50' : 'opacity-100'} -ml-1`} />
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Chatbot;
