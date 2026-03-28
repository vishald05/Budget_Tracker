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
        <div className="container mx-auto p-4 sm:p-6 max-w-4xl h-[calc(100vh-140px)] flex flex-col transition-colors duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-sm p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                    <Bot size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">AI Advisor</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Google Gemini</p>
                </div>
            </div>

            <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-4 overflow-y-auto flex flex-col gap-4 border-x border-gray-200 dark:border-gray-700">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : msg.role === 'error' ? 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-sm'}`}>
                                {msg.role === 'user' ? (
                                    <p>{msg.content}</p>
                                ) : (
                                    <div className="prose dark:prose-invert max-w-none text-sm space-y-2">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-3 rounded-2xl rounded-tl-sm gap-2 text-gray-500 dark:text-gray-400">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-sm border border-gray-200 dark:border-gray-700 border-t-0">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your spending habits..."
                        className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 text-white rounded-full p-3 transition-colors flex items-center justify-center w-12 h-12"
                    >
                        <Send size={20} className={`${isLoading ? 'opacity-50' : 'opacity-100'} -ml-1`} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
