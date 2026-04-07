import { useState } from 'react';
import { Phone, Copy, Check, Share2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { callGroq } from '@/lib/groq';

export default function IncidentTool() {
  const { t, tArr, lang } = useLanguage();
  const platforms = tArr('platforms');

  const [mode, setMode] = useState<'accident' | 'harass'>('accident');
  // Accident fields
  const [aDate, setADate] = useState('');
  const [aLocation, setALocation] = useState('');
  const [aPlatform, setAPlatform] = useState('');
  const [aWhat, setAWhat] = useState('');
  const [aInjuries, setAInjuries] = useState('');
  const [aPoliceCalled, setAPoliceCalled] = useState<boolean | null>(null);
  // Harass fields
  const [hPlatform, setHPlatform] = useState('');
  const [hDesc, setHDesc] = useState('');
  const [hBy, setHBy] = useState<'client' | 'company'>('client');
  const [hImpact, setHImpact] = useState('');

  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<{ title: string; content: string }[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = async () => {
    setLoading(true);
    const langNote = lang === 'hi' ? 'Respond entirely in Hindi.' : 'Respond in English.';
    let prompt = '';

    if (mode === 'accident') {
      prompt = `${langNote} Generate 2 documents separated by "---BREAK---":
1. An incident report formatted for FIR (First Information Report) submission to police, for a gig delivery worker who had an accident on ${aDate} at ${aLocation} while working for ${aPlatform}. What happened: ${aWhat}. Injuries: ${aInjuries}. Police called: ${aPoliceCalled ? 'Yes' : 'No'}. Include all standard FIR sections.
2. A formal complaint letter to ${aPlatform}'s grievance team demanding compensation, insurance coverage, and medical expenses under the Code on Social Security 2020.`;
    } else {
      prompt = `${langNote} Generate 2 documents separated by "---BREAK---":
1. An incident report formatted for FIR submission for a gig worker who was harassed by a ${hBy === 'client' ? 'customer/client' : 'company/platform representative'} while working for ${hPlatform}. Description: ${hDesc}. Safety impact: ${hImpact}. Include all standard FIR sections.
2. A formal complaint letter to ${hPlatform}'s grievance team demanding action against the harasser and safety measures under the POSH Act and Consumer Protection Act.`;
    }

    try {
      const result = await callGroq([
        { role: 'system', content: 'You are a legal document writer for Indian gig workers.' },
        { role: 'user', content: prompt },
      ], 2048);

      const parts = result.split('---BREAK---');
      setReports([
        { title: t('reportFIR'), content: parts[0]?.trim() || '' },
        { title: t('reportPlatform'), content: parts[1]?.trim() || '' },
      ]);
    } catch {
      setReports([{ title: 'Error', content: 'Could not generate report. Please add your Groq API key.' }]);
    }
    setLoading(false);
  };

  const copyText = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const canGenerate = mode === 'accident'
    ? aDate && aLocation && aPlatform && aWhat
    : hPlatform && hDesc && hImpact;

  return (
    <div>
      {/* Emergency banner */}
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 font-bold text-sm"
        style={{ background: '#1A0000', border: '1px solid #FF3B30', color: '#FF3B30' }}
      >
        <Phone size={16} />
        {t('emergencyBanner')}
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden mb-6" style={{ border: '1px solid #2A2A2A' }}>
        {(['accident', 'harass'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setReports([]); }}
            className="flex-1 py-3 font-bold text-sm transition-all"
            style={{
              background: mode === m ? '#FF5C00' : '#1A1A1A',
              color: mode === m ? '#000' : '#888',
            }}
          >
            {m === 'accident' ? t('accidentTab') : t('harassTab')}
          </button>
        ))}
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((r, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: '#141414', border: '1px solid #2A2A2A' }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#FF5C00' }}>{r.title}</h3>
              <div className="text-sm leading-relaxed mb-4 max-h-48 overflow-y-auto whitespace-pre-wrap" style={{ color: '#F0EDE8' }}>
                {r.content}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyText(r.content, i)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: copied === i ? '#1A3A1A' : '#1A1A1A', color: copied === i ? '#34C759' : '#F0EDE8', border: '1px solid #2A2A2A' }}
                >
                  {copied === i ? <Check size={14} /> : <Copy size={14} />}
                  {copied === i ? t('copied') : t('copy')}
                </button>
                <button
                  onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(r.content), '_blank')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: '#1A2A1A', color: '#25D366', border: '1px solid #2A2A2A' }}
                >
                  <Share2 size={14} /> {t('whatsapp')}
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setReports([])}
            className="w-full py-3 rounded-xl font-semibold text-sm"
            style={{ background: '#1A1A1A', color: '#888', border: '1px solid #2A2A2A' }}
          >
            {t('startOver')}
          </button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 size={36} className="animate-spin" style={{ color: '#FF5C00' }} />
          <p className="font-semibold" style={{ color: '#F0EDE8' }}>{t('generating')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mode === 'accident' ? (
            <>
              <input type="date" value={aDate} onChange={e => setADate(e.target.value)}
                className="w-full px-4 py-4 rounded-xl text-base"
                style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A', colorScheme: 'dark' }} />
              <input type="text" value={aLocation} onChange={e => setALocation(e.target.value)}
                placeholder={t('incidentLocation')}
                className="w-full px-4 py-4 rounded-xl text-base"
                style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A' }} />
              <select value={aPlatform} onChange={e => setAPlatform(e.target.value)}
                className="w-full px-4 py-4 rounded-xl text-base"
                style={{ background: '#1A1A1A', color: aPlatform ? '#F0EDE8' : '#666', border: '1px solid #2A2A2A' }}>
                <option value="">{t('platform')}</option>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <textarea value={aWhat} onChange={e => setAWhat(e.target.value)}
                placeholder={t('whatHappened')} rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A', resize: 'none' }} />
              <textarea value={aInjuries} onChange={e => setAInjuries(e.target.value)}
                placeholder={t('injuries')} rows={2}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A', resize: 'none' }} />
              <div>
                <p className="text-sm mb-2" style={{ color: '#888' }}>{t('policeCalled')}</p>
                <div className="flex gap-3">
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => setAPoliceCalled(v)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm"
                      style={{ background: aPoliceCalled === v ? '#FF5C00' : '#1A1A1A', color: aPoliceCalled === v ? '#000' : '#F0EDE8', border: `1px solid ${aPoliceCalled === v ? '#FF5C00' : '#2A2A2A'}` }}>
                      {v ? t('q3yes') : t('q3no')}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <select value={hPlatform} onChange={e => setHPlatform(e.target.value)}
                className="w-full px-4 py-4 rounded-xl text-base"
                style={{ background: '#1A1A1A', color: hPlatform ? '#F0EDE8' : '#666', border: '1px solid #2A2A2A' }}>
                <option value="">{t('platform')}</option>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <textarea value={hDesc} onChange={e => setHDesc(e.target.value)}
                placeholder={t('harassDesc')} rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A', resize: 'none' }} />
              <div>
                <p className="text-sm mb-2" style={{ color: '#888' }}>{t('harassBy')}</p>
                <div className="flex gap-3">
                  {(['client', 'company'] as const).map(v => (
                    <button key={v} onClick={() => setHBy(v)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm"
                      style={{ background: hBy === v ? '#FF5C00' : '#1A1A1A', color: hBy === v ? '#000' : '#F0EDE8', border: `1px solid ${hBy === v ? '#FF5C00' : '#2A2A2A'}` }}>
                      {v === 'client' ? t('client') : t('company')}
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={hImpact} onChange={e => setHImpact(e.target.value)}
                placeholder={t('safetyImpact')} rows={2}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: '#1A1A1A', color: '#F0EDE8', border: '1px solid #2A2A2A', resize: 'none' }} />
            </>
          )}

          <button
            onClick={generate}
            disabled={!canGenerate}
            className="w-full py-4 rounded-xl font-bold text-base mt-2"
            style={{ background: canGenerate ? '#FF5C00' : '#2A2A2A', color: canGenerate ? '#000' : '#555' }}
          >
            {t('generateReport')}
          </button>
        </div>
      )}
    </div>
  );
}
