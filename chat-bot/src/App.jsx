import { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar.jsx';
import MainContent from './MainContent.jsx';

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
      <Sidebar 
        isOpen={isSidebarOpen}
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onChatSelect={setActiveChat}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
      <MainContent 
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        messages={messages}
        inputMessage={inputMessage}
        level={level}
        onInputChange={setInputMessage}
        onLevelChange={setLevel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
