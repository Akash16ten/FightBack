import { Home, AlertTriangle, IndianRupee, Shield, MessageCircle } from 'lucide-react';
import type { Tab } from '@/pages/index';
import { useLanguage } from '@/lib/language';

interface BottomNavProps {
  active: Tab;
  onSelect: (tab: Tab) => void;
}

export default function BottomNav({ active, onSelect }: BottomNavProps) {
  const { t } = useLanguage();

  const tabs: { id: Tab; icon: React.ReactNode; label: string; badge?: string }[] = [
    { id: 'home',        icon: <Home size={22} />,          label: t('navHome') },
    { id: 'deactivated', icon: <AlertTriangle size={22} />, label: t('navDeactivated'), badge: '!' },
    { id: 'wages',       icon: <IndianRupee size={22} />,   label: t('navWages') },
    { id: 'rights',      icon: <Shield size={22} />,        label: t('navRights') },
    { id: 'chatbot',     icon: <MessageCircle size={22} />, label: t('navChat') },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
      style={{
        background: 'rgba(10,10,10,0.97)',
        borderTop: '1px solid #1E1E1E',
        backdropFilter: 'blur(12px)',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      {tabs.map(tab => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 relative transition-colors"
            style={{ color: isActive ? '#FF5C00' : '#555', minHeight: 56 }}
          >
            {/* Animated orange underline at top */}
            {isActive && (
              <span
                className="nav-underline absolute top-0 left-1/2 -translate-x-1/2 rounded-b"
                style={{ width: 24, height: 2, background: '#FF5C00', display: 'block' }}
              />
            )}

            {/* Icon with orange pill background when active */}
            <span
              className="relative flex items-center justify-center rounded-lg transition-all duration-200"
              style={{
                width: 36,
                height: 28,
                background: isActive ? 'rgba(255,92,0,0.15)' : 'transparent',
              }}
            >
              {tab.icon}
              {tab.badge && tab.id === 'deactivated' && (
                <span
                  className="absolute -top-1 -right-1 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  style={{ background: '#FF3B30', width: 14, height: 14 }}
                >
                  !
                </span>
              )}
            </span>

            <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
