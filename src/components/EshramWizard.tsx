import { useState } from 'react';
import { ExternalLink, Share2 } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { incrementUsage } from '@/lib/usageCounter';

// ── Confetti burst (pure CSS + inline SVG dots) ───────────────────────────────
function ConfettiBurst() {
  const pieces = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360;
    const dist = 60 + (i % 4) * 20;
    const colors = ['#FF5C00', '#FFB800', '#34C759', '#F0EDE8', '#FF3B30'];
    const color = colors[i % colors.length];
    const size = 4 + (i % 3) * 2;
    const delay = (i % 6) * 0.06;
    return { angle, dist, color, size, delay };
  });

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      {/* Confetti pieces */}
      {pieces.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.dist;
        const ty = Math.sin(rad) * p.dist;
        return (
          <span
            key={i}
            className="absolute rounded-sm"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              left: '50%',
              top: '50%',
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              animation: `confettiFly 0.7s ${p.delay}s cubic-bezier(0.25,0.46,0.45,0.94) both`,
              ['--tx' as string]: `${tx}px`,
              ['--ty' as string]: `${ty}px`,
            }}
          />
        );
      })}

      {/* Central checkmark */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width: 64,
          height: 64,
          background: '#FF5C00',
          animation: 'checkPulse 0.5s 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M7 16l6 6 12-12"
            stroke="#000"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: 'drawCheck 0.4s 0.6s ease both', strokeDasharray: 30, strokeDashoffset: 30 }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes confettiFly {
          from { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          to   { transform: translate(var(--tx), var(--ty)) rotate(360deg); opacity: 0; }
        }
        @keyframes checkPulse {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function EshramWizard() {
  const { t, lang } = useLanguage();
  const [showCelebration, setShowCelebration] = useState(false);

  const steps = [
    { num: 1, title: t('step1Title'), desc: t('step1Desc') },
    { num: 2, title: t('step2Title'), desc: t('step2Desc') },
    { num: 3, title: t('step3Title'), desc: t('step3Desc') },
    { num: 4, title: t('step4Title'), desc: t('step4Desc') },
    { num: 5, title: t('step5Title'), desc: t('step5Desc') },
    { num: 6, title: t('step6Title'), desc: t('step6Desc') },
  ];

  // Trigger celebration when component mounts (user navigated here intentionally)
  // Actually trigger when they click "Register Now" — we'll show it after a short delay
  const handleRegister = () => {
    setShowCelebration(true);
    incrementUsage();
    setTimeout(() => {
      window.open('https://eshram.gov.in', '_blank');
    }, 800);
  };

  const shareMsg = lang === 'hi'
    ? 'मैंने E-SHRAM पर रजिस्टर कर लिया! तुम भी करो — ₹2 लाख का बीमा मिलता है। FightBack app से करो: https://m6e90682d6.preview.c38.airoapp.ai'
    : 'I just registered on E-SHRAM! You should too — get ₹2 lakh insurance coverage. Do it via FightBack: https://m6e90682d6.preview.c38.airoapp.ai';

  return (
    <div>
      <div className="space-y-3 mb-6">
        {steps.map(step => (
          <div
            key={step.num}
            className="flex gap-4 p-4 rounded-xl"
            style={{ background: '#141414', border: '1px solid #2A2A2A' }}
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg"
              style={{ background: '#FF5C00', color: '#000' }}
            >
              {step.num}
            </div>
            <div>
              <h3 className="font-bold text-base mb-1" style={{ color: '#F0EDE8' }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#888' }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Benefit card */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{ background: '#001A0D', border: '2px solid #34C759' }}
      >
        <p className="font-bold text-sm leading-relaxed" style={{ color: '#34C759' }}>
          {t('eshramBenefit')}
        </p>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div
          className="rounded-2xl p-6 mb-6 flex flex-col items-center gap-4 tool-enter"
          style={{ background: '#0D0D0D', border: '2px solid #FF5C00' }}
        >
          <ConfettiBurst />
          <div className="text-center">
            <p className="text-xl font-black mb-1" style={{ color: '#F0EDE8', fontFamily: 'Space Grotesk, sans-serif' }}>
              {lang === 'hi' ? 'आप सुरक्षित हैं अब!' : "You're protected now."}
            </p>
            <p className="text-sm" style={{ color: '#888' }}>
              {lang === 'hi'
                ? 'किसी साथी कर्मचारी को भी बताएं।'
                : 'Share this with a fellow worker.'}
            </p>
          </div>
          <button
            onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(shareMsg), '_blank')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm"
            style={{ background: '#1A2A1A', color: '#25D366', border: '1px solid #2A3A2A' }}
          >
            <Share2 size={16} />
            {lang === 'hi' ? 'WhatsApp पर शेयर करें' : 'Share on WhatsApp'}
          </button>
        </div>
      )}

      {!showCelebration && (
        <button
          onClick={handleRegister}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-base"
          style={{ background: '#FF5C00', color: '#000', textDecoration: 'none' }}
        >
          {t('registerNow')} <ExternalLink size={18} />
        </button>
      )}
    </div>
  );
}
