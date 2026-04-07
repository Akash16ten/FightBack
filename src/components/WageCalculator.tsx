import { useState } from 'react';
import { Copy, Check, Share2, Loader2, AlertTriangle, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { callGroq } from '@/lib/groq';
import AiLoadingSteps from '@/components/AiLoadingSteps';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal',
  'Andaman & Nicobar Islands','Chandigarh','Dadra & Nagar Haveli','Daman & Diu',
  'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
];

// Approximate minimum wages (₹/hour) by state for unskilled workers
const MIN_WAGES: Record<string, number> = {
  'Delhi': 73, 'Maharashtra': 62, 'Karnataka': 58, 'Tamil Nadu': 55,
  'Telangana': 55, 'Gujarat': 52, 'Haryana': 65, 'Punjab': 55,
  'West Bengal': 48, 'Uttar Pradesh': 45, 'Rajasthan': 48, 'Madhya Pradesh': 45,
  'Bihar': 42, 'Jharkhand': 42, 'Odisha': 45, 'Andhra Pradesh': 52,
  'Kerala': 68, 'Goa': 65, 'Himachal Pradesh': 52, 'Uttarakhand': 50,
  'Assam': 42, 'Chhattisgarh': 45, 'default': 50,
};

export default function WageCalculator() {
  const { t, tArr, lang } = useLanguage();
  const platforms = tArr('platforms');

  const [platform, setPlatform] = useState('');
  const [state, setState] = useState('');
  const [hours, setHours] = useState('');
  const [orders, setOrders] = useState('');
  const [money, setMoney] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ underpaid: boolean; diff: number; perHour: number; minWage: number } | null>(null);
  const [letter, setLetter] = useState('');
  const [letterLoading, setLetterLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const calculate = async () => {
    if (!platform || !state || !hours || !money) return;
    setLoading(true);
    const perHour = parseFloat(money) / parseFloat(hours);
    const minWage = MIN_WAGES[state] || MIN_WAGES['default'];
    const diff = (minWage - perHour) * parseFloat(hours);
    setResult({ underpaid: perHour < minWage, diff: Math.round(diff), perHour: Math.round(perHour), minWage });
    setLoading(false);
  };

  const generateLetter = async () => {
    if (!result) return;
    setLetterLoading(true);
    const langNote = lang === 'hi' ? 'Respond entirely in Hindi.' : 'Respond in English.';
    try {
      const content = await callGroq([
        { role: 'system', content: 'You are a legal letter writer for Indian gig workers.' },
        { role: 'user', content: `${langNote} Write a formal wage complaint letter to the State Labour Commissioner of ${state} on behalf of a gig worker on ${platform}. The worker earned ₹${money} for ${hours} hours of work (${orders} orders/rides), which is ₹${result.perHour}/hour — below the state minimum wage of ₹${result.minWage}/hour. The shortfall is ₹${result.diff} this week. Cite the Minimum Wages Act 1948 and Code on Wages 2019. Demand investigation and back-payment. Make it formal and ready to send.` },
      ], 1024);
      setLetter(content);
    } catch {
      setLetter('Could not generate letter. Please add your Groq API key.');
    }
    setLetterLoading(false);
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="space-y-3 mb-6">
        <select
          value={platform}
          onChange={e => setPlatform(e.target.value)}
          className="w-full px-4 py-4 rounded-xl text-base"
          style={{ background: '#1A1A1A', color: platform ? '#F0EDE8' : '#666', border: '1px solid #2A2A2A' }}
        >
          <option value="">{t('platform')}</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          value={state}
          onChange={e => setState(e.target.value)}
          className="w-full px-4 py-4 rounded-xl text-base"
          style={{ background: '#1A1A1A', color: state ? '#F0EDE8' : '#666', border: '1px solid #2A2A2A' }}
        >
          <option value="">{t('state')}</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={hours}
            onChange={e => setHours(e.target.value)}
            placeholder={t('hoursWorked')}
            className="px-4 py-4 rounded-xl text-base"
            style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A' }}
          />
          <input
            type="number"
            value={orders}
            onChange={e => setOrders(e.target.value)}
            placeholder={t('ordersCompleted')}
            className="px-4 py-4 rounded-xl text-base"
            style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A' }}
          />
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold" style={{ color: '#FF5C00' }}>₹</span>
          <input
            type="number"
            value={money}
            onChange={e => setMoney(e.target.value)}
            placeholder={t('moneyReceived')}
            className="w-full pl-10 pr-4 py-4 rounded-xl text-base"
            style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A' }}
          />
        </div>
      </div>

      <button
        onClick={calculate}
        disabled={!platform || !state || !hours || !money || loading}
        className="w-full py-4 rounded-xl font-bold text-base mb-6 transition-all"
        style={{ background: platform && state && hours && money ? '#FF5C00' : '#2A2A2A', color: platform && state && hours && money ? '#000' : '#555' }}
      >
        {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : t('calculate')}
      </button>

      {result && (
        <div className="space-y-4">
          {result.underpaid ? (
            <div className="rounded-xl p-4" style={{ background: '#1A0000', border: '2px solid #FF3B30' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={20} style={{ color: '#FF3B30' }} />
                <span className="font-black text-base uppercase" style={{ color: '#FF3B30' }}>{t('underpaidAlert')}</span>
              </div>
              <p className="text-3xl font-black mb-1" style={{ color: '#FF3B30' }}>₹{result.diff}</p>
              <p className="text-sm" style={{ color: '#F0EDE8' }}>
                You earned ₹{result.perHour}/hr vs minimum wage of ₹{result.minWage}/hr in {state}
              </p>
            </div>
          ) : (
            <div className="rounded-xl p-4" style={{ background: '#001A00', border: '2px solid #34C759' }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={20} style={{ color: '#34C759' }} />
                <span className="font-bold text-base" style={{ color: '#34C759' }}>{t('aboveMinWage')}</span>
              </div>
              <p className="text-sm" style={{ color: '#F0EDE8' }}>₹{result.perHour}/hr earned vs ₹{result.minWage}/hr minimum in {state}</p>
            </div>
          )}

          {result.underpaid && !letterLoading && (
            <button
              onClick={generateLetter}
              disabled={letterLoading}
              className="w-full py-4 rounded-xl font-bold text-sm"
              style={{ background: '#FF5C00', color: '#000' }}
            >
              {t('generateComplaint')}
            </button>
          )}

          {letterLoading && <AiLoadingSteps />}

          {letter && (
            <div className="rounded-xl p-4" style={{ background: '#141414', border: '1px solid #2A2A2A' }}>
              <div className="text-sm leading-relaxed mb-4 max-h-48 overflow-y-auto whitespace-pre-wrap" style={{ color: '#F0EDE8' }}>
                {letter}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyText}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: copied ? '#1A3A1A' : '#1A1A1A', color: copied ? '#34C759' : '#F0EDE8', border: '1px solid #2A2A2A' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? t('copied') : t('copy')}
                </button>
                <button
                  onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(letter), '_blank')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: '#1A2A1A', color: '#25D366', border: '1px solid #2A2A2A' }}
                >
                  <Share2 size={14} /> {t('whatsapp')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-xs mt-6 text-center" style={{ color: '#555' }}>{t('disclaimer')}</p>
    </div>
  );
}
