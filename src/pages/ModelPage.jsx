import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { marketplaceModels } from '../data/mockData';
import ModelViewer3D from '../components/ModelViewer3D';
import { chatWithGemini, isGeminiConfigured } from '../services/geminiService';
import './ModelPage.css';

// Map short slugs to IDs
const SLUG_MAP = {
  heart: 'heart-001',
  generator: 'gen-001',
  motor: 'motor-001',
  cell: 'cell-001',
};

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function AIChatPanel({ model }) {
  const [messages, setMessages] = useState([]); // { role, content, streaming? }
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef(null);
  const streamRef = useRef('');

  const configured = isGeminiConfigured();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return;

    const userMsg = { role: 'user', content: text.trim() };
    const history = [...messages, userMsg];
    setMessages([...history, { role: 'assistant', content: '', streaming: true }]);
    setInput('');
    setIsStreaming(true);
    streamRef.current = '';

    const apiHistory = history.map(m => ({ role: m.role, content: m.content }));

    chatWithGemini(
      model,
      apiHistory,
      (chunk) => {
        streamRef.current += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: streamRef.current, streaming: true };
          return updated;
        });
      },
      () => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: streamRef.current, streaming: false };
          return updated;
        });
        setIsStreaming(false);
      },
      (err) => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: `⚠️ ${err}`, streaming: false, error: true };
          return updated;
        });
        setIsStreaming(false);
      }
    );
  }, [messages, isStreaming, model]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const QUICK_QUESTIONS = [
    `What is the ${model.name}?`,
    'How does it work?',
    model.parts?.[0] ? `Explain the ${model.parts[0].name}` : 'What are the key parts?',
    'Give me a real-world example',
  ];

  return (
    <div className="ai-chat-panel">
      <div className="ai-chat-header">
        <span className="ai-chat-icon">✦</span>
        <div>
          <div className="ai-chat-title">AI Tutor</div>
          <div className="ai-chat-subtitle">Ask anything about {model.name}</div>
        </div>
      </div>

      <div className="ai-chat-messages">
        {messages.length === 0 && (
          <div className="ai-chat-welcome">
            <div className="ai-chat-welcome-icon">🧠</div>
            <div className="ai-chat-welcome-text">
              Hi! I'm your AI tutor for the <strong>{model.name}</strong>.<br />
              Ask me anything or pick a quick question below.
            </div>
            <div className="ai-chat-quick-questions">
              {QUICK_QUESTIONS.map(q => (
                <button key={q} className="ai-quick-btn" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`ai-chat-bubble ${msg.role} ${msg.streaming ? 'streaming' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="ai-bubble-icon">✦</div>
            )}
            <div
              className="ai-bubble-content"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) || '<span class="ai-typing">●●●</span>' }}
            />
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {!configured ? (
        <div className="ai-chat-unconfigured">
          🔑 Add <code>VITE_OPENROUTER_API_KEY</code> to .env to enable AI chat
        </div>
      ) : (
        <div className="ai-chat-input-row">
          <textarea
            className="ai-chat-input"
            placeholder="Ask a question about this model..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isStreaming}
          />
          <button
            className="ai-chat-send"
            onClick={() => sendMessage(input)}
            disabled={isStreaming || !input.trim()}
          >
            {isStreaming ? '⏳' : '➤'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ModelPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine model ID: from :id param, slug map, or location pathname
  const slug = location.pathname.replace('/', '').split('/')[0];
  const resolvedId = id ? (SLUG_MAP[id] || id) : (SLUG_MAP[slug] || slug);
  const model = marketplaceModels.find(m => m.id === resolvedId);

  if (!model) {
    return (
      <div className="model-page-error">
        <h2>Model not found</h2>
        <p>We couldn't find a model with this URL.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  return (
    <div className="model-page">
      {/* Header */}
      <div className="model-page-header">
        <button className="model-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="model-page-title-group">
          <h1 className="model-page-title">{model.name}</h1>
          <span className="model-page-breadcrumb">{model.subject} › {model.chapter}</span>
        </div>
      </div>

      {/* Main Content: 3D Left, Chat Right */}
      <div className="model-page-body">
        <div className="model-page-left">
          <ModelViewer3D model={model} showAIBanner={false} />
        </div>
        <div className="model-page-right">
          <AIChatPanel model={model} />
        </div>
      </div>
    </div>
  );
}
