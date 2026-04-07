import { X, Phone } from 'lucide-react';
import { useLanguage } from '@/lib/language';

interface EmergencySheetProps {
  onClose: () => void;
}

const NUMBERS = [
  { label: 'Labour Helpline',  labelHi: 'श्रम हेल्पलाइन',   number: '1800-11-4000', color: '#FF5C00' },
  { label: 'Police',           labelHi: 'पुलिस',             number: '112',          color: '#FF3B30' },
  { label: 'Women Safety',     labelHi: 'महिला सुरक्षा',     number: '1091',         color: '#FF69B4' },
  { label: 'NHRC',             labelHi: 'NHRC (मानवाधिकार)', number: '14433',        color: '#FFB800' },
  { label: 'Cyber Crime',      labelHi: 'साइबर क्राइम',      number: '1930',         color: '#34C759' },
];

export default function EmergencySheet({ onClose }: EmergencySheetProps) {
  const { lang } = useLanguage();

  return (
    /* Full-screen overlay */
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
          <span
            className="text-xs font-black px-2 py-0.5 rounded"
            style={{ background: '#FF3B30', color: '#fff', letterSpacing: '0.08em' }}
          >
            {lang === 'hi' ? 'आपातकाल' : 'EMERGENCY'}
          </span>
          <h2
            className="text-lg font-black"
            style={{ color: '#F0EDE8', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {lang === 'hi' ? 'हेल्पलाइन नंबर' : 'Helpline Numbers'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
        >
          <X size={18} style={{ color: '#888' }} />
        </button>
      </div>

      {/* Numbers list */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {NUMBERS.map(item => (
          <div
            key={item.number}
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: '#141414', border: '1px solid #2A2A2A', borderLeft: `3px solid ${item.color}` }}
          >
            <div>
              <p className="font-bold text-base" style={{ color: '#F0EDE8' }}>
                {lang === 'hi' ? item.labelHi : item.label}
              </p>
              <p className="text-xl font-black mt-0.5" style={{ color: item.color, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}>
                {item.number}
              </p>
            </div>
            <a
              href={`tel:${item.number.replace(/-/g, '')}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
              style={{ background: item.color, color: '#000', textDecoration: 'none', flexShrink: 0 }}
            >
              <Phone size={16} />
              {lang === 'hi' ? 'कॉल करें' : 'CALL'}
            </a>
          </div>
        ))}

        {/* Disclaimer */}
        <p
          className="text-xs text-center pt-2"
          style={{ color: '#444' }}
        >
          {lang === 'hi'
            ? 'ये सरकारी हेल्पलाइन नंबर हैं। FightBack इनसे संबद्ध नहीं है।'
            : 'These are official government helplines. FightBack is not affiliated with them.'}
        </p>
      </div>
    </div>
  );
}
