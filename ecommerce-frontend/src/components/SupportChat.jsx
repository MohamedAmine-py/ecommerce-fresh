import { useState, useEffect, useRef } from "react";
import { sendSupportMessage } from "../api/client";
import "../styles/SupportChat.css";

// SVG Icons
const IconChatBubble = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hello! I'm the **NextLevel Configurator**, your expert PC builder and technical advisor. I'm here to help you build the ultimate gaming or workstation rig.\n\n- **Custom PC Builds** — recommendations for Gamer PCs and Workstations\n- **Hardware Compatibility** — check if your CPU, GPU, and motherboard match\n- **Performance Estimates** — framerates and rendering bottlenecks\n- **Peripherals & Accessories** — high-performance mice, keyboards, and cooling\n\nHow can I help you level up today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const historyEndRef = useRef(null);

  // Automatically scroll to the bottom when messages or loading states change
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput("");

    // Append user's message to local state
    const updatedMessages = [...messages, { role: "user", content: userQuery }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Format history to match what the backend expects (converting 'assistant' to 'model')
      const formattedHistory = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        content: msg.content
      }));

      // Call our Laravel API endpoint
      const response = await sendSupportMessage(userQuery, formattedHistory);

      if (response && response.status === "success") {
        setMessages(prev => [...prev, { role: "assistant", content: response.reply }]);
      } else if (response && response.reply) {
        // Handle error responses that contain a friendly fallback message from our backend
        setMessages(prev => [...prev, { role: "assistant", content: response.reply }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "Thank you for your message. I encountered a small technical issue connecting to the server. Please try again in a moment and I'll be happy to assist you!" 
        }]);
      }
    } catch (error) {
      console.error("Support Chat API Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "It looks like there was a temporary connection issue on our end. Please try sending your message again and I'll get right back to you!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe and clean custom React markdown rendering helper
  const renderFormattedContent = (text) => {
    if (!text) return "";
    
    // Split text by double newlines for paragraph breaks
    const paragraphs = text.split(/\n\n+/);
    
    return paragraphs.map((para, idx) => {
      const trimmedPara = para.trim();
      
      // Render bullet list items
      if (trimmedPara.startsWith("- ") || trimmedPara.startsWith("* ")) {
        const items = trimmedPara.split(/\n[-*]\s+/);
        items[0] = items[0].replace(/^[-*]\s+/, "");
        return (
          <ul key={idx} className="support-chat-list">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{parseInlineStyles(item)}</li>
            ))}
          </ul>
        );
      }
      
      // Render numbered list items
      if (/^\d+\.\s+/.test(trimmedPara)) {
        const items = trimmedPara.split(/\n\d+\.\s+/);
        items[0] = items[0].replace(/^\d+\.\s+/, "");
        return (
          <ol key={idx} className="support-chat-list">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{parseInlineStyles(item)}</li>
            ))}
          </ol>
        );
      }
      
      // Render default paragraph
      return (
        <p key={idx} style={{ marginBottom: idx === paragraphs.length - 1 ? 0 : "8px" }}>
          {parseInlineStyles(trimmedPara)}
        </p>
      );
    });
  };

  // Helper to parse **bold** and handle internal line breaks safely in React elements
  const parseInlineStyles = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      
      // Split single newlines to output <br /> tags
      const sublines = part.split("\n");
      return sublines.map((line, lineIdx) => (
        <span key={lineIdx}>
          {line}
          {lineIdx < sublines.length - 1 && <br />}
        </span>
      ));
    });
  };

  return (
    <>
      {/* Floating Chat Bubble Launcher */}
      {!isOpen && (
        <button 
          className="support-chat-launcher" 
          onClick={() => setIsOpen(true)}
          title="Next Level PC Support"
          aria-label="Open 24/7 support chat"
        >
          <IconChatBubble />
          <span className="support-chat-pulse" />
        </button>
      )}

      {/* Floating Support Chat Panel */}
      {isOpen && (
        <div className="support-chat-panel">
          {/* Header */}
          <div className="support-chat-header">
            <div className="support-chat-agent-info">
              <div className="support-chat-avatar">
                N
                <span className="support-chat-avatar-status" />
              </div>
              <div className="support-chat-agent-meta">
                <span className="support-chat-agent-name">NextLevel Configurator</span>
                <span className="support-chat-agent-role">Expert PC Builder • 24/7</span>
              </div>
            </div>
            <button 
              className="support-chat-close-btn" 
              onClick={() => setIsOpen(false)}
              title="Close support chat"
              aria-label="Close support chat"
            >
              <IconClose />
            </button>
          </div>

          {/* Messages Viewport */}
          <div className="support-chat-history">
            {messages.map((msg, index) => (
              <div key={index} className={`support-chat-message-row ${msg.role}`}>
                <div className="support-chat-bubble">
                  {renderFormattedContent(msg.content)}
                </div>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="support-chat-message-row assistant">
                <div className="support-chat-bubble" style={{ padding: "10px 14px" }}>
                  <div className="support-chat-typing-indicator">
                    <div className="support-chat-typing-dot" />
                    <div className="support-chat-typing-dot" />
                    <div className="support-chat-typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={historyEndRef} />
          </div>

          {/* Input Form Bar */}
          <form className="support-chat-input-bar" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about RTX 4090 builds, AM5 motherboards, compatibility..."
              className="support-chat-input-field"
              disabled={isLoading}
              maxLength={2000}
            />
            <button 
              type="submit" 
              className="support-chat-send-btn" 
              disabled={!input.trim() || isLoading}
              title="Send message"
              aria-label="Send message"
            >
              <IconSend />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
