'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarDots, 
  Kanban, 
  ChatCircleText, 
  Plus, 
  Sparkle,
  Strategy,
  Target,
  Camera,
  FileText
} from '@phosphor-icons/react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

// Components
import PremiumCalendarView from '@/components/content/PremiumCalendarView';
import ContentPipeline from '@/components/content/ContentPipeline';
import CopyBank from '@/components/content/CopyBank';
import PostModal from '@/components/content/PostModal';

export default function ContentHubPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'pipeline' | 'copybank'>('calendar');
  const [pieces, setPieces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  
  const { user } = useAuthStore();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await apiClient.get('/content-pieces');
      setPieces(res.data);
    } catch (err) {
      console.error('Failed to load content pieces:', err);
    } finally {
      setLoading(false);
    }
  }

  const TABS = [
    { id: 'calendar', label: 'Calendar', icon: CalendarDots },
    { id: 'pipeline', label: 'Pipeline', icon: Kanban },
    { id: 'copybank', label: 'Copy Bank', icon: ChatCircleText },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-[#08080f]">
      {/* Header with Glassmorphism */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/1 shadow-sm backdrop-blur-md sticky top-0 z-10 transition-all">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            <span className="text-primary-500">
              <CalendarDots size={28} weight="fill" />
            </span>
            Content Hub
          </h1>
          <p className="text-sm text-slate-400 font-medium">Plan, create, and manage across all social channels</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-white/5 p-1 rounded-xl border border-white/5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${activeTab === tab.id 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <tab.icon size={16} weight={activeTab === tab.id ? 'fill' : 'regular'} />
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary-900/30 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={18} weight="bold" />
            New Piece
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-[1400px] mx-auto h-full">
            {activeTab === 'calendar' && (
              <div className="animate-fade-in h-full">
                <PremiumCalendarView pieces={pieces} onUpdate={loadData} />
              </div>
            )}
            
            {activeTab === 'pipeline' && (
              <div className="animate-fade-in h-full">
                <ContentPipeline pieces={pieces} onUpdate={loadData} />
              </div>
            )}
            
            {activeTab === 'copybank' && (
              <div className="animate-fade-in h-full">
                <CopyBank />
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-900/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* Modals */}
      {showCreate && (
        <PostModal 
          open={showCreate} 
          onClose={() => setShowCreate(false)} 
          onSaved={loadData}
        />
      )}
    </div>
  );
}
