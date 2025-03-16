import { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar.jsx';
import MainContent from './MainContent.jsx';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [level, setLevel] = useState('beginner');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [chats, setChats] = useState([
    { id: 1, title: 'Quantum Physics Discussion', date: '2024-03-20' },
    { id: 2, title: 'Chemical Reactions', date: '2024-03-19' },
    { id: 3, title: 'Astronomy Basics', date: '2024-03-18' },
  ]);
  const [activeChat, setActiveChat] = useState(null);

  // Simulated streaming response - In a real app, this would come from your API
  const simulateStreamingResponse = async (userMessage) => {
    setIsStreaming(true);
    const response = `Let me explain this concept in detail. First, we need to understand the basics. Then, we can explore more advanced topics. This is a simulated response to your question about: "${userMessage}". I hope this helps clarify things for you!`;
    setStreamingContent('');
    
    // Split response into words and stream word by word
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setStreamingContent(prev => prev + (i === 0 ? '' : ' ') + words[i]);
    }
    
    setIsStreaming(false);
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      level: level
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');

    // Start streaming response
    const response = await simulateStreamingResponse(inputMessage);
    
    const newBotMessage = {
      id: Date.now() + 1,
      text: response,
      sender: 'bot',
      level: level
    };

    setMessages(prev => [...prev, newBotMessage]);
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
        isStreaming={isStreaming}
        streamingContent={streamingContent}
      />
    </div>
  );
}

export default App;
