import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Plus, Bot, Send, Loader2, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { streamMeeraResponse } from '../services/meeraService';
import { AuthContext } from '../context/AuthContext';

const MODES = [
  { id: 'exam', label: '🚨 Exam Emergency', tooltip: 'Last-minute exam prep — structured, fast, exam-focused', colorClass: 'text-red-400 bg-red-500/10 border-red-500 hover:bg-red-500/20' },
  { id: 'explainer', label: '💡 Concept Explainer', tooltip: 'Understand any concept with examples and analogies', colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500 hover:bg-blue-500/20' },
  { id: 'practice', label: '📝 Practice Mode', tooltip: 'Test yourself with viva-style questions', colorClass: 'text-green-400 bg-green-500/10 border-green-500 hover:bg-green-500/20' }
];

const SUGGESTIONS = [
  "Help me prepare for ML exam tomorrow",
  "Explain CNS cryptographic algorithms",
  "What are important SPM topics?",
  "NPTEL Cloud Computing Week 5 summary",
  "Explain with a real-world analogy",
  "Quiz me on Machine Learning"
];

const Meera = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeMode, setActiveMode] = useState('exam');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');

  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const qName = searchParams.get('name');
    const qTopic = searchParams.get('topic');
    if (qName) setSubject(qName);
    if (qTopic) setTopic(qTopic);
  }, [searchParams]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleInputResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  };

  const handleNewChat = () => {
    if (isStreaming) return;
    setMessages([]);
    setSearchParams({});
    setSubject('');
    setTopic('');
    setActiveMode('exam');
    toast.success('Started a new session with Meera.');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleSubmit = async (textOveride = null) => {
    const textToSend = typeof textOveride === 'string' ? textOveride : inputVal;
    if (!textToSend.trim() || isStreaming) return;

    const newUserMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, newUserMsg]);
    setInputVal('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setIsStreaming(true);

    // Create placeholder for Meera's response
    setMessages(prev => [...prev, { role: 'assistant', content: '', isTyping: true }]);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const stream = streamMeeraResponse({
        message: textToSend,
        mode: activeMode,
        subject: subject || 'General',
        topic: topic || 'General',
        history
      });

      let accumulatedContent = '';

      for await (const chunk of stream) {
        if (chunk.type === 'token') {
          accumulatedContent += chunk.content;
          setMessages(prev => {
            const newArr = [...prev];
            newArr[newArr.length - 1] = { role: 'assistant', content: accumulatedContent };
            return newArr;
          });
        } else if (chunk.type === 'done') {
          setIsStreaming(false);
        } else if (chunk.type === 'error') {
          toast.error(chunk.message || 'Stream error');
          setMessages(prev => {
            const newArr = [...prev];
            newArr[newArr.length - 1] = { role: 'assistant', content: accumulatedContent + '\n\n*(Error: Connection terminated)*' };
            return newArr;
          });
          setIsStreaming(false);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to connect to Meera');
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1] = { role: 'assistant', content: '*Sorry, I encountered an error. Please try again!*' };
        return newArr;
      });
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050810] text-gray-200 w-full overflow-hidden">

      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-[#0A0F1E] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 animate-[pulse_3s_ease-in-out_infinite] opacity-50 absolute inset-0 blur-md"></div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center relative z-10 border-2 border-[#0A0F1E] shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Sparkles className="text-white fill-white" size={20} />
            </div>
          </div>
          <div>
            <h1 className="text-white font-black text-lg tracking-wide">Meera</h1>
            <p className="text-gpcet-muted text-[11px] font-mono tracking-wider uppercase">Powered by  Prashanth &bull; llama-3.3-70b</p>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          disabled={isStreaming}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 disabled:opacity-50"
        >
          <Plus size={16} /> <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 p-3 bg-[#050810] border-b border-gpcet-border shrink-0 overflow-x-auto custom-scrollbar shadow-inner">
        {MODES.map(mode => (
          <button
            key={mode.id}
            title={mode.tooltip}
            onClick={() => setActiveMode(mode.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border shrink-0 outline-none ${activeMode === mode.id
                ? mode.colorClass + ' shadow-[0_0_15px_currentColor]'
                : 'bg-transparent border-gpcet-border text-gpcet-muted hover:bg-white/5 hover:text-gray-300'
              }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Context Bar */}
      <div className="py-3 px-4 sm:px-6 bg-[#0A0F1E]/50 border-b border-gpcet-border shrink-0">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex gap-2 items-center bg-[#111827] border border-gpcet-border rounded-xl px-3 py-1.5 shadow-inner focus-within:border-gpcet-accent transition-colors">
            <span className="text-[10px] uppercase font-bold text-gray-500 whitespace-nowrap hidden lg:inline">Subject:</span>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Machine Learning, CNS"
              className="w-full bg-transparent text-sm text-white outline-none placeholder-gray-600 font-medium"
            />
          </div>
          <div className="flex-1 flex gap-2 items-center bg-[#111827] border border-gpcet-border rounded-xl px-3 py-1.5 shadow-inner focus-within:border-gpcet-accent transition-colors">
            <span className="text-[10px] uppercase font-bold text-gray-500 whitespace-nowrap hidden lg:inline">Topic:</span>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Neural Networks, Unit 3"
              className="w-full bg-transparent text-sm text-white outline-none placeholder-gray-600 font-medium"
            />
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-[9px] sm:text-[10px] text-gpcet-muted font-mono tracking-wider uppercase bg-black/20 py-1 rounded border border-white/5 inline-block px-3 shadow-inner">
            {user?.branch || 'CSE'} &bull; Y{user?.year || '3'}S{user?.semester || '2'} &bull; Autonomous Context Applied
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-2xl mx-auto px-4 my-8">
            <div className="relative mb-6 group cursor-pointer" onClick={() => setActiveMode(activeMode === 'exam' ? 'explainer' : 'exam')}>
              <div className="absolute inset-0 bg-gpcet-accent rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1E1B4B] to-[#111827] flex items-center justify-center relative z-10 border border-gpcet-accent/30 shadow-[0_0_30px_rgba(139,92,246,0.3)] box-glow-accent">
                <Bot size={40} className="text-gpcet-accent" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">Namaste! I'm Meera <span className="inline-block hover:animate-bounce origin-bottom">🙏</span></h2>
            <p className="text-gpcet-accent font-bold mb-2 uppercase tracking-widest text-xs">Your AI study companion for GPCET</p>
            <p className="text-gray-400 font-medium mb-10 max-w-sm leading-relaxed text-sm">I have been configured to follow your precise R23 syllabus structure. Ask me anything.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(sug)}
                  className="bg-[#111827] border border-gpcet-border hover:border-gpcet-accent/50 hover:bg-[#1E1B4B]/30 p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-medium text-left text-gray-300 hover:text-indigo-200 transition-all shadow-lg hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{sug}</span>
                  <Send size={14} className="opacity-0 group-hover:opacity-100 text-gpcet-accent transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 pb-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end pl-12' : 'justify-start pr-12'}`}>

                {msg.role === 'user' ? (
                  <div className="flex flex-col items-end group">
                    <span className="text-[10px] text-gpcet-muted font-bold uppercase tracking-wider mb-1 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">You</span>
                    <div className="bg-blue-600 text-white px-5 py-3.5 rounded-3xl rounded-tr-sm shadow-[0_10px_20px_rgba(37,99,235,0.2)] text-[15px] leading-relaxed break-words border border-blue-500 max-w-full">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start w-full">
                    <div className="bg-[#111827] border-l-[3px] border-l-gpcet-accent border-y border-r border-[#1F2937] rounded-2xl rounded-tl-sm w-full shadow-xl">

                      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1F2937] bg-[#0A0F1E]/50 rounded-tr-2xl">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                          <Sparkles size={10} className="text-white fill-white" />
                        </div>
                        <span className="font-bold text-gpcet-accent text-sm tracking-wide">Meera</span>
                        <span className="text-[10px] text-gray-500 font-mono ml-auto">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="p-5 sm:p-6 prose prose-invert prose-sm sm:prose-base max-w-none 
                          prose-headings:text-indigo-200 prose-headings:font-black prose-headings:tracking-tight prose-headings:mb-3 prose-headings:mt-6
                          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-indigo-100 prose-strong:font-bold 
                          prose-code:text-gpcet-accent prose-code:bg-[#050810] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-white/5
                          prose-pre:bg-[#050810] prose-pre:border prose-pre:border-[#1F2937] prose-pre:shadow-inner
                          prose-li:marker:text-gpcet-accent overflow-hidden break-words">
                        {msg.isTyping ? (
                          <div className="flex items-center gap-3 text-gpcet-accent py-2 min-h-[2rem]">
                            <div className="flex gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-gpcet-accent animate-[bounce_1s_infinite_0ms]"></span>
                              <span className="w-2.5 h-2.5 rounded-full bg-gpcet-accent animate-[bounce_1s_infinite_150ms]"></span>
                              <span className="w-2.5 h-2.5 rounded-full bg-gpcet-accent animate-[bounce_1s_infinite_300ms]"></span>
                            </div>
                            <span className="text-sm font-medium italic opacity-80">Meera is thinking...</span>
                          </div>
                        ) : (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        )}
                      </div>
                    </div>

                    {!msg.isTyping && msg.content && (
                      <div className="flex items-center gap-1 mt-2 pl-2">
                        <button onClick={() => handleCopy(msg.content)} className="p-1.5 text-gray-500 hover:text-white hover:bg-[#111827] border border-transparent hover:border-gray-700 rounded-lg transition-colors tooltip-trigger flex items-center gap-1.5 text-xs font-medium bg-transparent" title="Copy to clipboard">
                          <Copy size={14} /> Copy
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-green-500/10 border border-transparent hover:border-green-500/20 rounded-lg transition-colors ml-2" title="Helpful response">
                          <ThumbsUp size={14} />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-colors" title="Inaccurate response">
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-[#0A0F1E] border-t border-gpcet-border shrink-0 p-3 sm:p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20">
        <div className="max-w-4xl mx-auto flex items-end gap-3 p-1 rounded-2xl bg-[#050810] border border-gpcet-border shadow-inner focus-within:border-gpcet-accent focus-within:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all">
          <textarea
            ref={textareaRef}
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              handleInputResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask Meera anything about your GPCET syllabus... (Shift+Enter for newline)"
            className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-white p-3 custom-scrollbar text-base placeholder-gray-600 leading-relaxed"
            rows={1}
            disabled={isStreaming}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!inputVal.trim() || isStreaming}
            className="p-3 mb-1 mr-1 rounded-xl bg-gpcet-accent text-white hover:bg-indigo-500 disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500 transition-all flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] disabled:shadow-none"
          >
            {isStreaming ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="-ml-0.5" />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Meera;
