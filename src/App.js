import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css'; // Make sure this path matches your file structure

const API_KEY = 'AIzaSyD2dG6sWpGSaskxZgDIWWvU2EjkBce6V8o';
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are HealthBot, a helpful AI assistant for health-related questions. Provide accurate, concise, and safe health advice. Do not diagnose or prescribe treatments. Always recommend consulting a healthcare professional for serious concerns. User query: ${input}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const botMessage = { role: 'bot', text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = { role: 'bot', text: 'Sorry, something went wrong. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>HealthBot</h1>
        <p>Your AI-powered health assistant (Consult a doctor for professional advice)</p>
      </header>

      <div className="chat-area">
       {messages.map((msg, index) => (
  <div
    key={index}
    className={`message-bubble ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}
    style={{
      marginBottom: '1rem',
      padding: '0.75rem 1rem',
      borderRadius: '12px',
      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
      textAlign: msg.role === 'user' ? 'right' : 'left',
      display: 'inline-block',
      whiteSpace: 'pre-wrap'
    }}
  >
    {msg.text}
  </div>
))}


       
        {loading && (
          <div className="typing-indicator" style={{ padding: '1rem', borderRadius: '12px', maxWidth: '80%' }}>
            Typing...
          </div>
        )}
      </div>

      <div className="input-area">
        <div className="input-container">
          <textarea
            className="input-textarea"
            rows="2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a health-related question..."
            disabled={loading}
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={loading}
          >
           ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;