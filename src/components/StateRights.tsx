import { useState } from 'react';
import { Copy, Check, Share2, Loader2, Download } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { callGroq } from '@/lib/groq';
import { incrementUsage } from '@/lib/usageCounter';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal',
  'Andaman & Nicobar Islands','Chandigarh','Dadra & Nagar Haveli','Daman & Diu',
  'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
];

export default function StateRights() {
  const { t, lang } = useLanguage();
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState('');
  const [copied, setCopied] = useState(false);

  const getCard = async () => {
    if (!state) return;
    setLoading(true);
    const langNote = lang === 'hi' ? 'Respond entirely in Hindi.' : 'Respond in English.';
    try {
      const result = await callGroq([
        { role: 'system', content: 'You are a legal expert on Indian labour law and gig worker rights.' },
        { role: 'user', content: `${langNote} Create a plain-language "Rights Card" for a gig worker in ${state}, India. Include:
1. Applicable gig worker laws in ${state} (mention specific state laws if any, plus central laws like Code on Social Security 2020, Code on Wages 2019, Minimum Wages Act 1948)
2. Current minimum wage floor for unskilled workers in ${state} (₹ per day and per hour)
3. Whether ${state} has a Gig Workers Welfare Board or any gig-specific legislation (be accurate — as of 2024, only Rajasthan has the Platform-Based Gig Workers Act 2023)
4. How to contact the ${state} Labour Department (include phone number or website if known)
5. One key action the worker can take right now

Format it clearly with section headers. Keep language simple and direct. This is for a delivery worker reading on their phone.` },
      ], 1024);
      setCard(result);
      incrementUsage();
    } catch {
      setCard('Could not generate rights card. Please add your Groq API key.');
    }
    setLoading(false);
  };

  const printCard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const safeCard = card.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const html = [
      '<!DOCTYPE html><html><head><meta charset="UTF-8">',
      `<title>Rights Card — ${state}</title>`,
      '<style>',
      '* { margin: 0; padding: 0; box-sizing: border-box; }',
      'body { font-family: Georgia, serif; font-size: 13px; line-height: 1.7; color: #111; padding: 40px 48px; max-width: 680px; margin: 0 auto; }',
      '.header { border-bottom: 3px solid #FF5C00; padding-bottom: 12px; margin-bottom: 20px; }',
      '.header h1 { font-size: 22px; font-weight: 900; color: #FF5C00; font-family: Arial, sans-serif; }',
      '.header p { font-size: 12px; color: #666; margin-top: 4px; }',
      '.content { white-space: pre-wrap; }',
      '.footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #ccc; font-size: 10px; color: #888; text-align: center; }',
      '@media print { body { padding: 20px 24px; } }',
      '</style></head><body>',
      '<div class="header">',
      '<h1>FightBack — Rights Card</h1>',
      `<p>State: ${state} &nbsp;|&nbsp; Generated: ${dateStr}</p>`,
      '</div>',
      `<div class="content">${safeCard}</div>`,
      '<div class="footer">FightBack provides general legal information, not formal legal advice.</div>',
      '</body></html>',
    ].join('\n');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 400);
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(card);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="space-y-3 mb-6">
        <select
          value={state}
          onChange={e => setState(e.target.value)}
          className="w-full px-4 py-4 rounded-xl text-base"
          style={{ background: '#1A1A1A', color: state ? '#F0EDE8' : '#666', border: '1px solid #2A2A2A' }}
        >
          <option value="">{t('selectState')}</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <button
          onClick={getCard}
          disabled={!state || loading}
          className="w-full py-4 rounded-xl font-bold text-base"
          style={{ background: state ? '#FF5C00' : '#2A2A2A', color: state ? '#000' : '#555' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" /> {t('gettingRights')}
            </span>
          ) : t('getRightsCard')}
        </button>
      </div>

      {card && (
        <div className="rounded-xl p-4" style={{ background: '#141414', border: '1px solid #2A2A2A' }}>
          <h3 className="font-black text-base mb-3" style={{ color: '#FF5C00' }}>
            {t('yourRightsCard')} — {state}
          </h3>
          <div
            className="text-sm leading-relaxed mb-4 whitespace-pre-wrap max-h-80 overflow-y-auto"
            style={{ color: '#F0EDE8' }}
          >
            {card}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={copyText}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ background: copied ? '#1A3A1A' : '#1A1A1A', color: copied ? '#34C759' : '#F0EDE8', border: '1px solid #2A2A2A' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? t('copied') : t('copy')}
            </button>
            <button
              onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(`${t('yourRightsCard')} — ${state}\n\n${card}`), '_blank')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ background: '#1A2A1A', color: '#25D366', border: '1px solid #2A2A2A' }}
            >
              <Share2 size={14} /> {t('shareRights')}
            </button>
            <button
              onClick={printCard}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ background: '#1A1A2A', color: '#6B9FFF', border: '1px solid #2A2A3A' }}
            >
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
