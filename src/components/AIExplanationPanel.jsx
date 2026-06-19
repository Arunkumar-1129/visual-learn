import React, { useState, useRef, useCallback, useEffect } from 'react';
import { explainWithGemini, isGeminiConfigured } from '../services/geminiService';
import './AIExplanationPanel.css';

function parseMarkdown(text) {
  // Convert **bold** to <strong>, and newlines to <br>
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export default function AIExplanationPanel({ model, focusedPart }) {
  const [status, setStatus] = useState('idle'); // idle | loading | streaming | done | error | unconfigured
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const contentRef = useRef('');
  const abortRef = useRef(false);

  const configured = isGeminiConfigured();

  const runExplanation = useCallback(() => {
    if (!configured) {
      setStatus('unconfigured');
      return;
    }

    abortRef.current = false;
    contentRef.current = '';
    setContent('');
    setStatus('loading');

    explainWithGemini(
      model,
      focusedPart || null,
      // onChunk
      (chunk) => {
        if (abortRef.current) return;
        contentRef.current += chunk;
        setContent(contentRef.current);
        setStatus('streaming');
      },
      // onDone
      () => {
        if (!abortRef.current) setStatus('done');
      },
      // onError
      (msg) => {
        if (!abortRef.current) {
          setErrorMsg(msg);
          setStatus('error');
        }
      }
    );
  }, [model, focusedPart, configured]);

  // Auto-trigger explanation when model changes (or on first mount)
  useEffect(() => {
    abortRef.current = true; // abort any previous in-flight request
    runExplanation();
    return () => {
      abortRef.current = true; // abort on unmount
    };
  }, [model.id]); // re-run when switching to a different model

  const handleCopy = () => {
    navigator.clipboard.writeText(contentRef.current);
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <span className="ai-gemini-icon">✦</span>
          <span>AI Explanation</span>
          {focusedPart && (
            <span className="ai-focus-badge">Focused: {focusedPart.name}</span>
          )}
        </div>
        <div className="ai-panel-actions">
          {(status === 'done' || status === 'streaming') && (
            <button className="ai-action-btn" onClick={handleCopy} title="Copy">
              📋 Copy
            </button>
          )}
          {status !== 'loading' && configured && (
            <button className="ai-action-btn ai-regen-btn" onClick={runExplanation}>
              {status === 'idle' ? '✦ Explain' : '🔄 Regenerate'}
            </button>
          )}
        </div>
      </div>

      <div className="ai-panel-body">
        {status === 'unconfigured' && (
          <div className="ai-unconfigured">
            <span>🔑</span>
            <div>
              <strong>API key not configured</strong>
              <p>Add <code>VITE_OPENROUTER_API_KEY=your_key</code> to your <code>.env</code> file and restart the dev server.</p>
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="ai-idle">
            {focusedPart
              ? `Click "✦ Explain" to get an AI explanation for ${focusedPart.name}.`
              : `Click "✦ Explain" to get an AI explanation for this model.`
            }
          </div>
        )}

        {status === 'loading' && (
          <div className="ai-loading">
            <div className="ai-loading-dots">
              <span /><span /><span />
            </div>
            <span>AI is thinking...</span>
          </div>
        )}

        {(status === 'streaming' || status === 'done') && content && (
          <div
            className={`ai-content ${status === 'streaming' ? 'streaming' : ''}`}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
          />
        )}

        {status === 'error' && (
          <div className="ai-error">
            <span>⚠️</span>
            <div>
              <strong>Couldn't get explanation</strong>
              <p>{errorMsg}</p>
              <button className="ai-action-btn" onClick={runExplanation}>Try again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

