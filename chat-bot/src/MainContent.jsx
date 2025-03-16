import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

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
                <ReactMarkdown 
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="heading-1" {...props} />,
                    h2: ({node, ...props}) => <h2 className="heading-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="heading-3" {...props} />,
                    p: ({node, ...props}) => <p className="paragraph" {...props} />,
                  }}
                >{message.text}</ReactMarkdown>
                {message.sender === 'user'}
              </div>
            </div>
          ))}
          
          {isStreaming && (
            <div className="message tutor-message">
              <div className="message-content">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="heading-1" {...props} />,
                    h2: ({node, ...props}) => <h2 className="heading-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="heading-3" {...props} />,
                    p: ({node, ...props}) => <p className="paragraph" {...props} />,
                  }}
                >{streamingContent}</ReactMarkdown>
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
    </main>
  );
}

export default MainContent;