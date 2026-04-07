import { useState } from 'react';
import { X, Copy, Check, Share2, Trash2, Clock } from 'lucide-react';
import { getHistory, clearHistory, type HistoryEntry } from '@/lib/letterHistory';
import { useLanguage } from '@/lib/language';

interface LetterHistorySheetProps {
  onClose: () => void;
}

export default function LetterHistorySheet({ onClose }: LetterHistorySheetProps) {
  const { lang } = useLanguage();
  const [entries, setEntries] = useState<HistoryEntry[]>(() => getHistory());
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleClear = () => {
    clearHistory();
    setEntries([]);
  };

  const copyLetter = async (content: string, key: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const shareWhatsApp = (content: string) => {
    window.open('https://wa.me/?text=' + encodeURIComponent(content), '_blank');
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#0A0A0A' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: '1px solid #1E1E1E' }}
      >
        <div className="flex items-center gap-2">
          <Clock size={18} style={{ color: '#FF5C00' }} />
          <h2
            className="text-lg font-black"
            style={{ color: '#F0EDE8', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {lang === 'hi' ? 'पत्र इतिहास' : 'Letter History'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: '#1A0A0A', color: '#FF3B30', border: '1px solid #2A1A1A' }}
            >
              <Trash2 size={12} />
              {lang === 'hi' ? 'सब हटाएं' : 'Clear all'}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
          >
            <X size={18} style={{ color: '#888' }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 pb-20">
            <Clock size={40} style={{ color: '#2A2A2A' }} />
            <p className="text-sm text-center" style={{ color: '#555' }}>
              {lang === 'hi'
                ? 'अभी तक कोई पत्र नहीं बना। पहला पत्र बनाएं!'
                : 'No letters generated yet. Create your first one!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <div
                key={entry.id}
                className="rounded-xl overflow-hidden"
                style={{ background: '#111', border: '1px solid #2A2A2A' }}
              >
                {/* Entry header */}
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  style={{ borderBottom: expanded === entry.id ? '1px solid #1E1E1E' : 'none' }}
                  onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                >
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#F0EDE8' }}>
                      {entry.name} · {entry.platform}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#555' }}>
                      {formatDate(entry.timestamp)}
                    </p>
                  </div>
                  <span style={{ color: '#FF5C00', fontSize: 18 }}>
                    {expanded === entry.id ? '−' : '+'}
                  </span>
                </button>

                {/* Expanded letters */}
                {expanded === entry.id && (
                  <div className="px-4 pb-4 space-y-3 pt-3">
                    {entry.letters.map((letter, li) => {
                      const copyKey = `${entry.id}-${li}`;
                      return (
                        <div
                          key={li}
                          className="rounded-lg overflow-hidden"
                          style={{ border: '1px solid #1E1E1E' }}
                        >
                          <div
                            className="flex items-center justify-between px-3 py-2"
                            style={{ background: '#0D0D0D', borderBottom: '1px solid #1E1E1E' }}
                          >
                            <span className="text-xs font-bold" style={{ color: '#FF5C00' }}>
                              {letter.title}
                            </span>
                            <span
                              className="text-[9px] font-black px-1.5 py-0.5 rounded"
                              style={{ color: '#FF3B30', border: '1px solid #FF3B30', letterSpacing: '0.1em' }}
                            >
                              LEGAL NOTICE
                            </span>
                          </div>
                          <div
                            className="px-3 py-3 text-xs leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto"
                            style={{ color: '#999', fontFamily: 'var(--font-mono)', background: '#111' }}
                          >
                            {letter.content}
                          </div>
                          <div
                            className="flex gap-2 px-3 py-2"
                            style={{ background: '#0D0D0D' }}
                          >
                            <button
                              onClick={() => copyLetter(letter.content, copyKey)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                              style={{
                                background: copied === copyKey ? '#1A3A1A' : '#1A1A1A',
                                color: copied === copyKey ? '#34C759' : '#F0EDE8',
                                border: '1px solid #2A2A2A',
                              }}
                            >
                              {copied === copyKey ? <Check size={12} /> : <Copy size={12} />}
                              {copied === copyKey
                                ? (lang === 'hi' ? 'कॉपी हुआ ✓' : 'Copied ✓')
                                : (lang === 'hi' ? 'कॉपी' : 'Copy')}
                            </button>
                            <button
                              onClick={() => shareWhatsApp(letter.content)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                              style={{ background: '#1A2A1A', color: '#25D366', border: '1px solid #2A2A2A' }}
                            >
                              <Share2 size={12} />
                              WhatsApp
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
