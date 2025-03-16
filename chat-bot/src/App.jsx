import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './Sidebar.jsx';
import MainContent from './MainContent.jsx';
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [pythonCode, setPythonCode] = useState('');
  const [level, setLevel] = useState('beginner');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [pythonOutput, setPythonOutput] = useState('');
  const [chats, setChats] = useState([
    { id: 1, title: 'Quantum Physics', date: '2024-03-20' },
    { id: 3, title: 'Astronomy Basics', date: '2024-03-18' },
  ]);
  const [activeChat, setActiveChat] = useState(null);

  const executePythonCode = async (code) => {
    try {
      const response = await axios.post('http://localhost:8080/api/execute', {
        code
      });
      return response.data.output;
    } catch (error) {
      console.error('Error executing Python code:', error);
      return 'Error occurred while executing Python code';
    }
  };

  const fetchTutorResponse = async (question, level) => {
    try {
      setIsStreaming(true);
      setStreamingContent('');
      let fullResponse = '';

      const response = await fetch('http://localhost:8080/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, level })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(6);
            fullResponse += content;
            setStreamingContent(fullResponse);
          }
        }
      }

      setIsStreaming(false);
      return fullResponse;
    } catch (error) {
      console.error('Error fetching tutor response:', error);
      setIsStreaming(false);
      return 'Error occurred while fetching response';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (inputMessage.trim()) {
      const newUserMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        level: level
      };

      setMessages(prev => [...prev, newUserMessage]);
      setInputMessage('');

      const response = await fetchTutorResponse(inputMessage, level);
      setStreamingContent(''); // Clear streaming content after getting full response
      
      const newBotMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        level: level
      };

      setMessages(prev => [...prev, newBotMessage]);
    }

    if (pythonCode.trim()) {
      const newCodeMessage = {
        id: Date.now() + 2,
        text: `Python Code:\n${pythonCode}`,
        sender: 'user',
        level: level
      };

      setMessages(prev => [...prev, newCodeMessage]);
      const output = await executePythonCode(pythonCode);
      
      const newOutputMessage = {
        id: Date.now() + 3,
        text: `Output:\n${output}`,
        sender: 'bot',
        level: level
      };

      setMessages(prev => [...prev, newOutputMessage]);
      setPythonCode('');
    }
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
        pythonCode={pythonCode}
        onPythonCodeChange={setPythonCode}
        onSubmit={handleSubmit}
        isStreaming={isStreaming}
        streamingContent={streamingContent}
        pythonOutput={pythonOutput}
      />
    </div>
  );
}

export default App;
