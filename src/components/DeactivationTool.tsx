import { useState } from 'react';
import { ChevronRight, Copy, Check, Share2, ArrowLeft, Info, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { callGroq } from '@/lib/groq';
import AiLoadingSteps from '@/components/AiLoadingSteps';
import LetterHistorySheet from '@/components/LetterHistorySheet';
import { saveToHistory } from '@/lib/letterHistory';
import { incrementUsage } from '@/lib/usageCounter';

interface Letter { title: string; content: string }

export default function DeactivationTool() {
  const { t, tArr, lang } = useLanguage();
  const platforms = tArr('platforms');

  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState('');
  const [date, setDate] = useState('');
  const [hasReason, setHasReason] = useState<boolean | null>(null);
  const [reason, setReason] = useState('');
  const [months, setMonths] = useState('');
  const [mobile, setMobile] = useState('');
  const [agentId, setAgentId] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const totalSteps = 8;

  const handleGenerate = async () => {
    setLoading(true);
    const langNote = lang === 'hi' ? 'Respond entirely in Hindi.' : 'Respond in English.';
    const prompt = `${langNote}
You are a legal assistant for Indian gig workers. Generate 3 separate formal complaint/appeal letters for a gig worker who was deactivated.

Worker details:
- Name: ${name}
- City: ${city}
- Platform: ${platform}
- Registered mobile number: ${mobile}
- Partner / Delivery Agent ID: ${agentId}
- Vehicle number: ${vehicle || 'Not applicable'}
- Deactivation date: ${date}
- Reason given by platform: ${hasReason ? reason : 'No reason given'}
- Months worked on platform: ${months}

Generate exactly 3 letters separated by "---LETTER_BREAK---":

LETTER 1: To the Platform Grievance Officer. Formal appeal citing IT Grievance Rules 2021, demanding reinstatement and a written explanation. Reference the worker's Agent ID (${agentId}), registered mobile (${mobile}), service duration of ${months} months, and vehicle number if applicable. Demand acknowledgement within 48 hours.

LETTER 2: To the State Labour Commissioner. Citing Code on Social Security 2020 Section 114, arguing the worker is a dependent contractor entitled to protections. Include the Agent ID and platform name as evidence of the employment relationship. Request investigation and reinstatement.

LETTER 3: To National Consumer Helpline (1800-11-4000). Citing Consumer Protection Act 2019, arguing unfair trade practice and arbitrary deactivation without due process. Include Agent ID and mobile number for reference. Request mediation.

Each letter must be complete, professional, and ready to send. Include today's date, subject line, salutation, body paragraphs, and closing with the worker's full name, city, mobile number, and Agent ID.`;

    try {
      const result = await callGroq([
        { role: 'system', content: 'You are a legal letter writer for Indian gig workers.' },
        { role: 'user', content: prompt },
      ], 2048);

      const parts = result.split('---LETTER_BREAK---');
      const titles = [t('letterA'), t('letterB'), t('letterC')];
      const generated = parts.slice(0, 3).map((content, i) => ({
        title: titles[i] || `Letter ${i + 1}`,
        content: content.trim(),
      }));
      setLetters(generated);
      // Persist to history + increment usage counter
      saveToHistory({ platform, name, city, timestamp: Date.now(), letters: generated });
      incrementUsage();
    } catch {
      setLetters([{ title: 'Error', content: 'Could not generate letters. Please add your Groq API key.' }]);
    }
    setLoading(false);
  };

  const copyText = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const shareWhatsApp = (text: string) => {
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  };

  const reset = () => {
    setStep(1); setPlatform(''); setDate(''); setHasReason(null);
    setReason(''); setMonths(''); setMobile(''); setAgentId('');
    setVehicle(''); setName(''); setCity(''); setLetters([]);
  };

  // ── Nav helpers ──────────────────────────────────────────────────────────
  const NavButtons = ({
    onBack,
    onNext,
    nextDisabled,
    isLast = false,
  }: {
    onBack: () => void;
    onNext: () => void;
    nextDisabled: boolean;
    isLast?: boolean;
  }) => (
    <div className="flex gap-3 mt-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 px-4 py-3 rounded-xl font-semibold text-sm"
        style={{ background: '#1A1A1A', color: '#888', border: '1px solid #2A2A2A' }}
      >
        <ArrowLeft size={16} /> {t('back')}
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1 flex items-center justify-center gap-1 py-3 rounded-xl font-bold text-sm transition-all"
        style={{ background: !nextDisabled ? '#FF5C00' : '#2A2A2A', color: !nextDisabled ? '#000' : '#555' }}
      >
        {isLast ? t('generate') : <>{t('next')} <ChevronRight size={16} /></>}
      </button>
    </div>
  );

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return <AiLoadingSteps />;
  }

  // ── Letters result ───────────────────────────────────────────────────────
  if (letters.length > 0) {
    return (
      <div className="pb-4 tool-enter">
        {letters.map((letter, i) => (
          <div
            key={i}
            className="mb-5 rounded-xl overflow-hidden"
            style={{
              background: '#111',
              border: '1px solid #2A2A2A',
              boxShadow: '0 2px 16px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.03)',
            }}
          >
            {/* Document header bar */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ background: '#0D0D0D', borderBottom: '1px solid #222' }}
            >
              <h3 className="font-bold text-sm" style={{ color: '#FF5C00', fontFamily: 'Space Grotesk, sans-serif' }}>
                {letter.title}
              </h3>
              {/* LEGAL NOTICE stamp */}
              <span
                className="text-[9px] font-black px-2 py-0.5 rounded tracking-widest"
                style={{
                  background: 'transparent',
                  color: '#FF3B30',
                  border: '1.5px solid #FF3B30',
                  letterSpacing: '0.12em',
                  fontFamily: 'var(--font-mono)',
                  opacity: 0.85,
                }}
              >
                LEGAL NOTICE
              </span>
            </div>

            {/* Letter body — monospace, document feel */}
            <div
              className="px-4 py-4 max-h-52 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed"
              style={{
                color: '#C8C4BC',
                fontFamily: 'var(--font-mono)',
                background: '#111',
                borderBottom: '1px solid #1E1E1E',
              }}
            >
              {letter.content}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 px-4 py-3" style={{ background: '#0D0D0D' }}>
              <button
                onClick={() => copyText(letter.content, i)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: copied === i ? '#1A3A1A' : '#1A1A1A', color: copied === i ? '#34C759' : '#F0EDE8', border: '1px solid #2A2A2A' }}
              >
                {copied === i ? <Check size={14} /> : <Copy size={14} />}
                {copied === i ? t('copied') : t('copy')}
              </button>
              <button
                onClick={() => shareWhatsApp(letter.content)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold"
                style={{ background: '#1A2A1A', color: '#25D366', border: '1px solid #2A2A2A' }}
              >
                <Share2 size={14} />
                {t('whatsapp')}
              </button>
            </div>
          </div>
        ))}
        <div
          className="rounded-xl p-4 mb-4 text-center font-bold text-sm"
          style={{ background: '#1A0D00', border: '1px solid #FF5C00', color: '#FF5C00' }}
        >
          {t('lettersCTA')}
        </div>
        <button
          onClick={reset}
          className="w-full py-3 rounded-xl font-semibold text-sm"
          style={{ background: '#1A1A1A', color: '#888', border: '1px solid #2A2A2A' }}
        >
          {t('startOver')}
        </button>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* History sheet overlay */}
      {showHistory && <LetterHistorySheet onClose={() => setShowHistory(false)} />}

      {/* Progress bar + history icon row */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs mb-2" style={{ color: '#888' }}>
          <span>{t('step')} {step} {t('of')} {totalSteps}</span>
          <div className="flex items-center gap-3">
            <span>{Math.round((step / totalSteps) * 100)}%</span>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ background: '#1A1A1A', color: '#888', border: '1px solid #2A2A2A' }}
              title="View letter history"
            >
              <Clock size={12} />
              <span className="text-[10px] font-semibold">History</span>
            </button>
          </div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#2A2A2A' }}>
          <div
            className="h-1.5 rounded-full transition-all duration-500 progress-glow"
            style={{ width: `${(step / totalSteps) * 100}%`, background: '#FF5C00' }}
          />
        </div>
      </div>

      {/* Step 1 — Platform */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#F0EDE8' }}>{t('q1')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => { setPlatform(p); setStep(2); }}
                className="py-4 px-3 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: platform === p ? '#FF5C00' : '#1A1A1A',
                  color: platform === p ? '#000' : '#F0EDE8',
                  border: `1px solid ${platform === p ? '#FF5C00' : '#2A2A2A'}`,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Date */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#F0EDE8' }}>{t('q2')}</h2>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-4 rounded-xl text-base font-medium"
            style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A', colorScheme: 'dark' }}
          />
          <NavButtons onBack={() => setStep(1)} onNext={() => setStep(3)} nextDisabled={!date} />
        </div>
      )}

      {/* Step 3 — Reason */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#F0EDE8' }}>{t('q3')}</h2>
          <div className="flex gap-3 mb-4">
            {[true, false].map(val => (
              <button
                key={String(val)}
                onClick={() => setHasReason(val)}
                className="flex-1 py-4 rounded-xl font-bold text-base transition-all"
                style={{
                  background: hasReason === val ? '#FF5C00' : '#1A1A1A',
                  color: hasReason === val ? '#000' : '#F0EDE8',
                  border: `1px solid ${hasReason === val ? '#FF5C00' : '#2A2A2A'}`,
                }}
              >
                {val ? t('q3yes') : t('q3no')}
              </button>
            ))}
          </div>
          {hasReason && (
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={t('q3reason')}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A', resize: 'none' }}
            />
          )}
          <NavButtons onBack={() => setStep(2)} onNext={() => setStep(4)} nextDisabled={hasReason === null} />
        </div>
      )}

      {/* Step 4 — Months worked */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#F0EDE8' }}>{t('q4')}</h2>
          <input
            type="number"
            value={months}
            onChange={e => setMonths(e.target.value)}
            placeholder="e.g. 8"
            min="1"
            className="w-full px-4 py-4 rounded-xl text-2xl font-bold"
            style={{ background: '#1A1A1A', color: '#FF5C00', border: '1px solid #2A2A2A' }}
          />
          <NavButtons onBack={() => setStep(3)} onNext={() => setStep(5)} nextDisabled={!months} />
        </div>
      )}

      {/* Step 5 — Mobile number */}
      {step === 5 && (
        <div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#F0EDE8' }}>{t('q6mobile')}</h2>
          <p className="text-sm mb-5" style={{ color: '#888' }}>{t('q6mobileSub')}</p>
          <input
            type="tel"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="e.g. 9876543210"
            maxLength={10}
            className="w-full px-4 py-4 rounded-xl text-xl font-bold tracking-widest"
            style={{ background: '#1A1A1A', color: '#FF5C00', border: '1px solid #2A2A2A' }}
          />
          <NavButtons onBack={() => setStep(4)} onNext={() => setStep(6)} nextDisabled={mobile.length < 10} />
        </div>
      )}

      {/* Step 6 — Agent ID */}
      {step === 6 && (
        <div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#F0EDE8' }}>{t('q7agentId')}</h2>
          <div
            className="flex items-start gap-2 px-3 py-3 rounded-xl mb-5"
            style={{ background: '#1A1500', border: '1px solid #3A3000' }}
          >
            <Info size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#FFB800' }} />
            <p className="text-xs leading-relaxed" style={{ color: '#FFB800' }}>{t('q7agentIdHelper')}</p>
          </div>
          <input
            type="text"
            value={agentId}
            onChange={e => setAgentId(e.target.value)}
            placeholder={t('q7agentIdPlaceholder')}
            className="w-full px-4 py-4 rounded-xl text-base font-bold"
            style={{ background: '#1A1A1A', color: '#FF5C00', border: '1px solid #2A2A2A' }}
          />
          <NavButtons onBack={() => setStep(5)} onNext={() => setStep(7)} nextDisabled={!agentId.trim()} />
        </div>
      )}

      {/* Step 7 — Vehicle number (optional) */}
      {step === 7 && (
        <div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#F0EDE8' }}>{t('q8vehicle')}</h2>
          <p className="text-sm mb-5" style={{ color: '#888' }}>{t('q8vehicleSub')}</p>
          <input
            type="text"
            value={vehicle}
            onChange={e => setVehicle(e.target.value)}
            placeholder={t('q8vehiclePlaceholder')}
            className="w-full px-4 py-4 rounded-xl text-base font-bold uppercase"
            style={{ background: '#1A1A1A', color: '#FF5C00', border: '1px solid #2A2A2A' }}
          />
          {/* Optional — always allow next */}
          <NavButtons onBack={() => setStep(6)} onNext={() => setStep(8)} nextDisabled={false} />
        </div>
      )}

      {/* Step 8 — Name & city */}
      {step === 8 && (
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#F0EDE8' }}>{t('q5name')}</h2>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('q5name')}
            className="w-full px-4 py-4 rounded-xl text-base mb-3"
            style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A' }}
          />
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder={t('q5city')}
            className="w-full px-4 py-4 rounded-xl text-base"
            style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A' }}
          />
          <NavButtons
            onBack={() => setStep(7)}
            onNext={handleGenerate}
            nextDisabled={!name.trim() || !city.trim()}
            isLast
          />
        </div>
      )}
    </div>
  );
}
