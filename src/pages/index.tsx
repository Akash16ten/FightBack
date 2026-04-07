import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import type { TranslationKey } from '@/lib/language';
import BottomNav from '@/components/BottomNav';
import DeactivationTool from '@/components/DeactivationTool';
import WageCalculator from '@/components/WageCalculator';
import IncidentTool from '@/components/IncidentTool';
import EshramWizard from '@/components/EshramWizard';
import StateRights from '@/components/StateRights';
import ChatBot from '@/components/ChatBot';
import EmergencySheet from '@/components/EmergencySheet';
import { getUsageCount } from '@/lib/usageCounter';

export type Tab = 'home' | 'deactivated' | 'wages' | 'rights' | 'chatbot';
export type RightsSection = 'incident' | 'eshram' | 'state' | null;

// ── Card SVG icons ────────────────────────────────────────────────────────────
const IconBrokenChain = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#FF5C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#FF5C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="2" x2="12" y2="5" stroke="#FF5C00" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="19" x2="12" y2="22" stroke="#FF5C00" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconRupeeCoin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#FF5C00" strokeWidth="2"/>
    <path d="M9 8h6M9 11h6M13 11l-3 5" stroke="#FF5C00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 8.5c0 1.38 1.34 2.5 3 2.5" stroke="#FF5C00" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 17l-1.5-1.5" stroke="#FF5C00" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="17" cy="17" r="2" fill="#FF5C00"/>
    <path d="M16.3 16.3l1.4 1.4" stroke="#0A0A0A" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const IconShieldCross = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="#FF5C00" strokeWidth="2" strokeLinejoin="round"/>
    <line x1="9" y1="9" x2="15" y2="15" stroke="#FF5C00" strokeWidth="2" strokeLinecap="round"/>
    <line x1="15" y1="9" x2="9" y2="15" stroke="#FF5C00" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconIdCard = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#FF5C00" strokeWidth="2"/>
    <circle cx="8" cy="12" r="2.5" stroke="#FF5C00" strokeWidth="1.8"/>
    <line x1="13" y1="10" x2="19" y2="10" stroke="#FF5C00" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="13" y1="13" x2="17" y2="13" stroke="#FF5C00" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconMapIndia = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8 2 5 4 4 7c-1 2 0 4 1 5.5C6.5 15 7 17 7 19l2 3h2l1-2 1 2h2l2-3c0-2 .5-4 2-6.5 1-1.5 2-3.5 1-5.5C19 4 16 2 12 2z" stroke="#FF5C00" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="1.5" fill="#FF5C00"/>
  </svg>
);

const IconPhone = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CARD_ICONS = [IconBrokenChain, IconRupeeCoin, IconShieldCross, IconIdCard, IconMapIndia];

// ── Animated counter hook ─────────────────────────────────────────────────────
function useAnimatedCount(target: number, duration = 1200) {
  const [display, setDisplay] = useState(target);
  const startRef = useRef<number | null>(null);
  const startValRef = useRef(Math.max(target - 80, 0));

  useEffect(() => {
    startValRef.current = Math.max(target - 80, 0);
    startRef.current = null;
    let raf: number;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startValRef.current + (target - startValRef.current) * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return display;
}

// ── Floating particles (pure CSS) ─────────────────────────────────────────────
function HeroParticles() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${5 + (i * 6.5) % 90}%`,
    delay: `${(i * 0.4) % 6}s`,
    duration: `${6 + (i * 0.7) % 6}s`,
    size: i % 3 === 0 ? 4 : 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: '-6px',
            width: p.size,
            height: p.size,
            background: '#FF5C00',
            opacity: 0.08,
            animation: `floatUp ${p.duration} ${p.delay} ease-in infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0)   scale(1);   opacity: 0.08; }
          50%  { opacity: 0.12; }
          100% { transform: translateY(-280px) scale(0.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Main app ──────────────────────────────────────────────────────────────────
export default function FightBackApp() {
  const { t, toggleLang } = useLanguage();
  const [tab, setTab] = useState<Tab>('home');
  const [rightsSection, setRightsSection] = useState<RightsSection>(null);
  const [showEmergency, setShowEmergency] = useState(false);

  const navigateTo = (newTab: Tab, section?: RightsSection) => {
    setTab(newTab);
    if (section) setRightsSection(section);
  };

  const homeCards = [
    { title: t('card1Title'), desc: t('card1Desc'), urgent: true,  onClick: () => navigateTo('deactivated') },
    { title: t('card2Title'), desc: t('card2Desc'), urgent: false, onClick: () => navigateTo('wages') },
    { title: t('card3Title'), desc: t('card3Desc'), urgent: false, onClick: () => navigateTo('rights', 'incident') },
    { title: t('card4Title'), desc: t('card4Desc'), urgent: false, onClick: () => navigateTo('rights', 'eshram') },
    { title: t('card5Title'), desc: t('card5Desc'), urgent: false, onClick: () => navigateTo('rights', 'state') },
  ];

  const toolTitles: Record<Tab, string> = {
    home: t('appName'),
    deactivated: t('tool1Title'),
    wages: t('tool2Title'),
    rights: '',
    chatbot: t('chatTitle'),
  };

  return (
    <div
      className="min-h-screen flex flex-col hex-bg"
      style={{ background: '#0A0A0A', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Emergency sheet overlay */}
      {showEmergency && <EmergencySheet onClose={() => setShowEmergency(false)} />}

      {/* Top bar */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #1A1A1A', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-2">
          {tab !== 'home' && (
            <button
              onClick={() => { setTab('home'); setRightsSection(null); }}
              className="mr-1 p-1 rounded-lg"
              style={{ color: '#888' }}
            >
              ←
            </button>
          )}
          <span className="font-black text-lg" style={{ color: '#FF5C00', fontFamily: 'Space Grotesk, sans-serif' }}>
            {tab === 'home' ? t('appName') : ''}
          </span>
          {tab !== 'home' && (
            <span className="font-black text-base" style={{ color: '#F0EDE8', fontFamily: 'Space Grotesk, sans-serif' }}>
              {tab === 'rights' ? getRightsTitle(rightsSection, t) : toolTitles[tab]}
            </span>
          )}
        </div>
        <button
          onClick={toggleLang}
          className="px-3 py-1.5 rounded-lg font-bold text-sm"
          style={{ background: '#1A1A1A', color: '#FF5C00', border: '1px solid #2A2A2A' }}
        >
          {t('langToggle')}
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {tab === 'home' && (
          <HomeScreen
            cards={homeCards}
            t={t}
            onEmergency={() => setShowEmergency(true)}
            onRights={() => navigateTo('rights', 'state')}
          />
        )}
        {tab === 'deactivated' && (
          <ToolWrapper sub={t('tool1Sub')}>
            <DeactivationTool />
          </ToolWrapper>
        )}
        {tab === 'wages' && (
          <ToolWrapper sub={t('tool2Sub')}>
            <WageCalculator />
          </ToolWrapper>
        )}
        {tab === 'rights' && (
          <RightsScreen section={rightsSection} setSection={setRightsSection} t={t} />
        )}
        {tab === 'chatbot' && (
          <ChatBot />
        )}
      </main>

      {/* Bottom nav */}
      <BottomNav active={tab} onSelect={(newTab) => { setTab(newTab); if (newTab !== 'rights') setRightsSection(null); }} />
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getRightsTitle(section: RightsSection, t: (k: TranslationKey) => string) {
  if (section === 'incident') return t('tool3Title');
  if (section === 'eshram')   return t('tool4Title');
  if (section === 'state')    return t('tool5Title');
  return t('navRights');
}

function ToolWrapper({ sub, children }: { sub: string; children: React.ReactNode }) {
  return (
    <div className="tool-enter">
      {sub && <p className="text-sm mb-5" style={{ color: '#888' }}>{sub}</p>}
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#FF5C00' }} />
      <h2 className="text-2xl font-black" style={{ color: '#F0EDE8', fontFamily: 'Space Grotesk, sans-serif' }}>
        {children}
      </h2>
    </div>
  );
}

function RightsScreen({
  section,
  setSection,
  t,
}: {
  section: RightsSection;
  setSection: (s: RightsSection) => void;
  t: (k: TranslationKey) => string;
}) {
  if (section === 'incident') return <ToolWrapper sub={t('tool3Sub')}><IncidentTool /></ToolWrapper>;
  if (section === 'eshram')   return <ToolWrapper sub={t('tool4Sub')}><EshramWizard /></ToolWrapper>;
  if (section === 'state')    return <ToolWrapper sub={t('tool5Sub')}><StateRights /></ToolWrapper>;

  const items = [
    { key: 'incident' as RightsSection, title: t('tool3Title'), desc: t('tool3Sub'), Icon: IconShieldCross },
    { key: 'eshram'   as RightsSection, title: t('tool4Title'), desc: t('tool4Sub'), Icon: IconIdCard },
    { key: 'state'    as RightsSection, title: t('tool5Title'), desc: t('tool5Sub'), Icon: IconMapIndia },
  ];

  return (
    <div className="tool-enter">
      <SectionHeading>{t('navRights')}</SectionHeading>
      <p className="text-sm mb-6" style={{ color: '#888' }}>{t('heroSub')}</p>
      <div className="space-y-3">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => setSection(item.key)}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-left card-hover active:scale-[0.98]"
            style={{ background: '#141414', border: '1px solid #2A2A2A', borderLeft: '3px solid #FF5C00' }}
          >
            <item.Icon />
            <div className="flex-1">
              <p className="font-bold text-base mb-0.5" style={{ color: '#F0EDE8' }}>{item.title}</p>
              <p className="text-xs" style={{ color: '#888' }}>{item.desc}</p>
            </div>
            <ChevronRight size={18} style={{ color: '#FF5C00', flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function HomeScreen({
  cards,
  t,
  onEmergency,
  onRights,
}: {
  cards: { title: string; desc: string; urgent: boolean; onClick: () => void }[];
  t: (k: TranslationKey) => string;
  onEmergency: () => void;
  onRights: () => void;
}) {
  const usageCount = getUsageCount();
  const animatedCount = useAnimatedCount(usageCount);
  const [showAbout, setShowAbout] = useState(false);
  const { lang } = useLanguage();

  const shareApp = () => {
    const url = window.location.href;
    const msg = lang === 'hi'
      ? `FightBack भारत के गिग वर्कर्स के लिए एक मुफ्त टूल है। कानूनी अपील लेटर पाएं, अपनी मजदूरी जांचें और अपने अधिकार जानें। यहाँ देखें: ${url}`
      : `FightBack is a free tool for gig workers in India. Get legal appeal letters, check your wages, and know your rights instantly. Try it here: ${url}`;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  };

  return (
    <div className="tool-enter">
      {/* Hero */}
      <div className="mb-8 pt-2 relative" style={{ minHeight: 140 }}>
        {/* Particles */}
        <HeroParticles />

        {/* Orange gradient glow */}
        <div
          className="absolute -top-4 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(255,92,0,0.12) 0%, transparent 70%)' }}
        />

        <h1
          className="text-4xl font-black leading-tight mb-3 relative"
          style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
        >
          <HeroTitle raw={t('heroTitle')} />
        </h1>
        <p className="text-base relative" style={{ color: '#888' }}>{t('heroSub')}</p>
        {/* Tagline */}
        <p className="text-xs mt-1.5 relative" style={{ color: '#444' }}>
          Made for India&apos;s 2.3 Crore gig workers.
        </p>
      </div>

      {/* Animated orange divider */}
      <div className="h-px mb-6 relative overflow-hidden rounded-full">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #FF5C00 0%, rgba(255,92,0,0.3) 60%, transparent 100%)' }}
        />
      </div>

      {/* Action cards */}
      <div className="space-y-3 mb-4">
        {cards.map((card, i) => {
          const Icon = CARD_ICONS[i];
          return (
            <button
              key={i}
              onClick={card.onClick}
              className="w-full flex items-center gap-4 p-4 rounded-xl text-left card-hover active:scale-[0.98]"
              style={{
                background: '#141414',
                border: '1px solid #2A2A2A',
                borderLeft: '3px solid #FF5C00',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              <Icon />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-base" style={{ color: '#F0EDE8' }}>{card.title}</p>
                  {card.urgent && (
                    <span
                      className="urgent-pulse text-[10px] font-black px-1.5 py-0.5 rounded"
                      style={{ background: '#FF3B30', color: '#fff', display: 'inline-block' }}
                    >
                      {t('urgent')}
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: '#888' }}>{card.desc}</p>
              </div>
              <ChevronRight size={18} style={{ color: '#FF5C00', flexShrink: 0 }} />
            </button>
          );
        })}

        {/* Emergency Numbers card — red accent */}
        <button
          onClick={onEmergency}
          className="w-full flex items-center gap-4 p-4 rounded-xl text-left card-hover active:scale-[0.98]"
          style={{
            background: '#140808',
            border: '1px solid #2A1A1A',
            borderLeft: '3px solid #FF3B30',
            transition: 'box-shadow 0.2s ease',
          }}
        >
          <IconPhone />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-base" style={{ color: '#F0EDE8' }}>
                Emergency Numbers
              </p>
              <span
                className="text-[10px] font-black px-1.5 py-0.5 rounded"
                style={{ background: '#FF3B30', color: '#fff' }}
              >
                SOS
              </span>
            </div>
            <p className="text-xs" style={{ color: '#888' }}>Police · Labour · Women Safety · NHRC · Cyber</p>
          </div>
          <ChevronRight size={18} style={{ color: '#FF3B30', flexShrink: 0 }} />
        </button>
      </div>

      {/* Animated usage counter */}
      <div
        className="flex items-center justify-center gap-2 py-4 rounded-xl mb-4"
        style={{ background: '#141414', border: '1px solid #2A2A2A' }}
      >
        <span className="text-2xl font-black tabular-nums" style={{ color: '#FF5C00' }}>
          {animatedCount.toLocaleString('en-IN')}+
        </span>
        <span className="text-sm font-semibold" style={{ color: '#888' }}>workers helped</span>
      </div>

      {/* About modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div
            className="w-full max-w-lg rounded-t-2xl p-6 tool-enter"
            style={{ background: '#141414', border: '1px solid #2A2A2A', borderBottom: 'none' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ background: '#FF5C00' }} />
              <h3 className="font-black text-lg" style={{ color: '#F0EDE8', fontFamily: 'Space Grotesk, sans-serif' }}>
                About FightBack
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#AAA' }}>
              FightBack was built for India&apos;s 2.3 crore gig workers who deliver our food, drive our cabs, and power our cities — without basic legal protection. This app is free, forever. No ads. No data selling. Just justice.
            </p>
            <button
              onClick={() => setShowAbout(false)}
              className="w-full py-3 rounded-xl font-bold text-sm"
              style={{ background: '#FF5C00', color: '#000' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-6 pb-2" style={{ borderTop: '1px solid #1A1A1A' }}>
        <p className="text-center font-bold text-sm mb-3" style={{ color: '#FF5C00' }}>{t('footerTagline')}</p>
        <div className="flex justify-center gap-4 mb-4">
          <button onClick={onRights} className="text-xs" style={{ color: '#555' }}>{t('footerRights')}</button>
          <button onClick={() => setShowAbout(true)} className="text-xs" style={{ color: '#555' }}>{t('footerAbout')}</button>
          <a href="mailto:fightbacksupport@gmail.com" className="text-xs" style={{ color: '#555', textDecoration: 'none' }}>{t('footerContact')}</a>
        </div>

        {/* Share FightBack */}
        <button
          onClick={shareApp}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm mb-4"
          style={{ background: '#1A2A1A', color: '#25D366', border: '1px solid #2A3A2A' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.22-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.25-1.44l-.38-.22-3.67.96.98-3.58-.25-.4A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.93 9.93 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.47-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.19-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"
              fill="white"
            />
          </svg>
          {lang === 'hi' ? 'FightBack को व्हाट्सएप पर शेयर करें' : 'Share FightBack on WhatsApp'}
        </button>

        <p className="text-center text-xs" style={{ color: '#444' }}>{t('footerDisclaimer')}</p>
      </div>
    </div>
  );
}

function HeroTitle({ raw }: { raw: string }) {
  const fightBackMatch = raw.match(/^([\s\S]*?)(fight back\.?)(\s*)$/i);
  if (fightBackMatch) {
    return (
      <>
        <span style={{ color: '#F0EDE8' }}>{fightBackMatch[1]}</span>
        <span style={{ color: '#FF5C00' }}>{fightBackMatch[2]}</span>
      </>
    );
  }
  const lines = raw.split('\n');
  if (lines.length > 1) {
    const last = lines.pop()!;
    return (
      <>
        <span style={{ color: '#F0EDE8' }}>{lines.join('\n')}{'\n'}</span>
        <span style={{ color: '#FF5C00' }}>{last}</span>
      </>
    );
  }
  return <span style={{ color: '#F0EDE8' }}>{raw}</span>;
}
