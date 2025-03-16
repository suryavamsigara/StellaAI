function MainContent({
  isSidebarOpen,
  onToggleSidebar,
  messages,
  inputMessage,
  level,
  onInputChange,
  onLevelChange,
  onPythonCodeChange,
  pythonCode,
  onSubmit,
  isStreaming,
  streamingContent,
  pythonOutput
}) {
  return (
    <main className="main-content">
      <header className="header">
        <button 
          className="mobile-menu-button"
          onClick={onToggleSidebar}
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
              <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                {message.sender === 'user'}
              </div>
            </div>
          ))}
          
          {isStreaming && (
            <div className="message tutor-message">
              <div className="message-content">
                <p>{streamingContent}</p>
                <span className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </div>
            </div>
          )}
        </div>

        <form className="input-form" onSubmit={onSubmit}>
          <div className="input-container">
            <select
              value={level}
              onChange={(e) => onLevelChange(e.target.value)}
              className="level-select"
              disabled={isStreaming}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Type your question here..."
              className="message-input"
              disabled={isStreaming}
            />

            
            <button 
              type="submit" 
              className={`send-button ${isStreaming ? 'disabled' : ''}`}
              disabled={isStreaming}
            >
              {isStreaming ? 'Generating...' : 'Send'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .python-input {
          width: 100%;
          margin-top: 10px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
        }

        .typing-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          margin-top: 8px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #666;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .send-button.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message-input:disabled,
        .python-input:disabled,
        .level-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .messages {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px;
          overflow-y: auto;
          flex-grow: 1;
        }

        .message-content {
          position: relative;
          word-break: break-word;
        }

        .message-content p {
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </main>
  );
}

export default MainContent;