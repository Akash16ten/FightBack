import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/lib/language';

const STEPS_EN = [
  'Analyzing your case...',
  'Checking state laws...',
  'Drafting legal language...',
  'Almost ready...',
];

const STEPS_HI = [
  'आपका मामला विश्लेषण हो रहा है...',
  'राज्य के कानून जांचे जा रहे हैं...',
  'कानूनी भाषा तैयार हो रही है...',
  'लगभग तैयार...',
];

export default function AiLoadingSteps() {
  const { lang } = useLanguage();
  const steps = lang === 'hi' ? STEPS_HI : STEPS_EN;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= steps.length - 1) return;
    const timer = setTimeout(() => setCurrent(c => c + 1), 1500);
    return () => clearTimeout(timer);
  }, [current, steps.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      {/* Animated orange ring */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="4"
          />
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="#FF5C00"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="175"
            strokeDashoffset="44"
            style={{
              transformOrigin: '50% 50%',
              animation: 'spin 1.2s linear infinite',
            }}
          />
        </svg>
        <span style={{ fontSize: 24 }}>⚖️</span>
      </div>

      {/* Steps */}
      <div className="w-full max-w-xs space-y-3">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500"
              style={{
                background: active ? '#1A0D00' : done ? '#0D1A0D' : '#111',
                border: `1px solid ${active ? '#FF5C00' : done ? '#34C759' : '#1E1E1E'}`,
                opacity: i > current ? 0.35 : 1,
              }}
            >
              {/* Status icon */}
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: done ? '#34C759' : active ? '#FF5C00' : '#2A2A2A',
                  transition: 'background 0.3s',
                }}
              >
                {done
                  ? <Check size={13} color="#000" />
                  : active
                    ? <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                    : <span className="w-2 h-2 rounded-full" style={{ background: '#444' }} />
                }
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: done ? '#34C759' : active ? '#F0EDE8' : '#555' }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
