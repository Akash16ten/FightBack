import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { callGroq, type GroqMessage } from '@/lib/groq';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ── Web Speech API type augmentation ────────────────────────────────────────
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const speechSupported = !!getSpeechRecognition();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, []);

  const SYSTEM_PROMPT = `You are FightBack AI, a legal assistant for Indian gig workers on platforms like Zomato, Swiggy, Uber, Ola, Blinkit, Urban Company, Rapido, Zepto, Flipkart Minutes, BigBasket, Jio Instamart, and Dunzo. You help workers understand their rights, draft complaint letters, calculate wages, and take action. Be direct, empowering, and simple. Avoid legal jargon. Always end responses with one clear action the worker can take right now. ${lang === 'hi' ? 'Respond in Hindi.' : 'Respond in English.'}`;

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: Message = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history: GroqMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: trimmed },
    ];

    try {
      const reply = await callGroq(history, 512);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: lang === 'hi'
          ? 'कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।'
          : 'Could not connect. Please try again.',
      }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  // ── Voice recording ────────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) {
      setShowTooltip(true);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = setTimeout(() => setShowTooltip(false), 3500);
      return;
    }

    const recognition = new SR();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0]?.[0]?.transcript ?? '';
      if (transcript) {
        setInput(prev => (prev ? prev + ' ' + transcript : transcript));
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      // 'aborted' fires when we call stop() ourselves — ignore it
      if (e.error !== 'aborted') {
        console.warn('Speech recognition error:', e.error);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
      inputRef.current?.focus();
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [lang]);

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const prompts = [t('chatPrompt1'), t('chatPrompt2'), t('chatPrompt3'), t('chatPrompt4')];

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 120px)' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-black" style={{ color: '#F0EDE8', fontFamily: 'Space Grotesk, sans-serif' }}>
          {t('chatTitle')}
        </h2>
        <p className="text-sm mt-0.5" style={{ color: '#888' }}>{t('chatSub')}</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-2">
        {messages.length === 0 && (
          <div>
            <p className="text-xs mb-3" style={{ color: '#555' }}>
              {lang === 'hi' ? 'एक विषय चुनें या अपना सवाल लिखें:' : 'Pick a topic or type your question:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {prompts.map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="px-3 py-2 rounded-full text-sm font-semibold"
                  style={{ background: '#1A1A1A', color: '#FF5C00', border: '1px solid #FF5C00' }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                background: msg.role === 'user' ? '#FF5C00' : '#141414',
                color: msg.role === 'user' ? '#000' : '#F0EDE8',
                borderBottomRightRadius: msg.role === 'user' ? 4 : undefined,
                borderBottomLeftRadius: msg.role === 'assistant' ? 4 : undefined,
                border: msg.role === 'assistant' ? '1px solid #2A2A2A' : 'none',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2"
              style={{ background: '#141414', border: '1px solid #2A2A2A' }}
            >
              <Loader2 size={14} className="animate-spin" style={{ color: '#FF5C00' }} />
              <span className="text-sm" style={{ color: '#888' }}>{t('chatThinking')}</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="flex gap-2 pt-3 mt-auto"
        style={{ borderTop: '1px solid #1A1A1A' }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder={isRecording
            ? (lang === 'hi' ? 'सुन रहा हूँ...' : 'Listening...')
            : t('chatPlaceholder')
          }
          className="flex-1 px-4 py-3 rounded-xl text-sm"
          style={{
            background: '#1A1A1A',
            color: '#F0EDE8',
            border: `1px solid ${isRecording ? '#FF3B30' : '#2A2A2A'}`,
            transition: 'border-color 0.2s',
          }}
        />

        {/* Mic button */}
        <div className="relative flex-shrink-0">
          <button
            onClick={handleMicClick}
            title={speechSupported
              ? (isRecording
                ? (lang === 'hi' ? 'रिकॉर्डिंग रोकें' : 'Stop recording')
                : (lang === 'hi' ? 'बोलकर टाइप करें' : 'Speak to type'))
              : undefined
            }
            className="w-12 h-12 rounded-xl flex items-center justify-center relative"
            style={{
              background: isRecording ? '#2A0A0A' : '#1A1A1A',
              border: `1px solid ${isRecording ? '#FF3B30' : '#2A2A2A'}`,
              transition: 'background 0.2s, border-color 0.2s',
            }}
          >
            {/* Pulsing red ring while recording */}
            {isRecording && (
              <span
                className="absolute inset-0 rounded-xl animate-ping"
                style={{ background: 'rgba(255,59,48,0.25)' }}
              />
            )}

            {/* Pulsing red dot indicator */}
            {isRecording && (
              <span
                className="absolute top-2 right-2 rounded-full animate-pulse"
                style={{ width: 7, height: 7, background: '#FF3B30' }}
              />
            )}

            {isRecording
              ? <MicOff size={18} color="#FF3B30" />
              : <Mic size={18} color={speechSupported ? '#888' : '#444'} />
            }
          </button>

          {/* Unsupported tooltip */}
          {showTooltip && (
            <div
              className="absolute bottom-14 right-0 w-52 px-3 py-2 rounded-xl text-xs leading-snug z-50"
              style={{
                background: '#1A1A1A',
                border: '1px solid #3A3A3A',
                color: '#F0EDE8',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
              }}
            >
              {lang === 'hi'
                ? 'यह ब्राउज़र वॉइस सपोर्ट नहीं करता। Chrome आज़माएं।'
                : 'Voice not supported on this browser. Try Chrome.'
              }
              {/* Arrow */}
              <span
                className="absolute -bottom-1.5 right-4"
                style={{
                  width: 10, height: 10,
                  background: '#1A1A1A',
                  border: '1px solid #3A3A3A',
                  borderTop: 'none', borderLeft: 'none',
                  transform: 'rotate(45deg)',
                  display: 'block',
                }}
              />
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: input.trim() && !loading ? '#FF5C00' : '#2A2A2A' }}
        >
          <Send size={18} color={input.trim() && !loading ? '#000' : '#555'} />
        </button>
      </div>
    </div>
  );
}
