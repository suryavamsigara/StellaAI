import { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [level, setLevel] = useState('beginner');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, title: 'Quantum Physics Discussion', date: '2024-03-20' },
    { id: 2, title: 'Chemical Reactions', date: '2024-03-19' },
    { id: 3, title: 'Astronomy Basics', date: '2024-03-18' },
  ]);
  const [activeChat, setActiveChat] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      level: level
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Conversation',
      date: new Date().toISOString().split('T')[0]
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
    setMessages([]);
  };

  const handleLogin = () => {
    // TODO: Implement login functionality
    console.log('Login clicked');
  };

  const handleSignup = () => {
    // TODO: Implement signup functionality
    console.log('Signup clicked');
  };

  return (
    <div className="app">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Cosmo</h2>
        </div>
        <button className="new-chat-button" onClick={handleNewChat}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Chat
        </button>
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
              onClick={() => setActiveChat(chat.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <div>
                <div>{chat.title}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{chat.date}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <button className="auth-button" onClick={handleLogin}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            Log in
          </button>
          <button className="auth-button signup" onClick={handleSignup}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Sign up
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <button 
            className="mobile-menu-button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1>Cosmo</h1>
        </header>
        
        <div className="chat-container">
          <div className="messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'tutor-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  {message.sender === 'user' && (
                    <span className="level-tag">{message.level}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form className="input-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="level-select"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your science question here..."
                className="message-input"
              />
              
              <button type="submit" className="send-button">
                Send
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
