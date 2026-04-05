'use client';

import { useState } from 'react';
import { 
  CaretLeft, 
  CaretRight, 
  Plus,
  InstagramLogo,
  FacebookLogo,
  TiktokLogo,
  TwitterLogo,
  LinkedinLogo,
  YoutubeLogo,
  SnapchatLogo
} from '@phosphor-icons/react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';

const PLATFORM_ICONS: Record<string, any> = {
  instagram: { Icon: InstagramLogo, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  facebook:  { Icon: FacebookLogo,  color: 'text-blue-400', bg: 'bg-blue-500/10' },
  tiktok:    { Icon: TiktokLogo,    color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  twitter:   { Icon: TwitterLogo,   color: 'text-sky-400', bg: 'bg-sky-500/10' },
  linkedin:  { Icon: LinkedinLogo,  color: 'text-blue-500', bg: 'bg-blue-600/10' },
  youtube:   { Icon: YoutubeLogo,   color: 'text-red-400', bg: 'bg-red-500/10' },
  snapchat:  { Icon: SnapchatLogo,  color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
};

export default function PremiumCalendarView({ pieces, onUpdate }: { pieces: any[], onUpdate: () => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  const getPiecesForDay = (day: Date) => {
    return pieces.filter(p => {
      if (!p.publish_at) return false;
      const d = new Date(p.publish_at);
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate()
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d14] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between p-4 bg-white/1 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold text-white min-w-[200px]" style={{ fontFamily: 'var(--font-display)' }}>
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-all"
            >
              Today
            </button>
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <span>Scheduled</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Published</span>
          </div>
        </div>
      </div>

      {/* Week Headers */}
      <div className="grid grid-cols-7 border-b border-white/5 bg-white/1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="py-2.5 text-center text-[11px] font-bold uppercase tracking-widest text-slate-500 border-r border-white/5 last:border-r-0">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 h-full overflow-hidden">
        {days.map((day, idx) => {
          const inMonth = isSameMonth(day, currentMonth);
          const dayPieces = getPiecesForDay(day);
          const active = isToday(day);

          return (
            <div 
              key={day.toISOString()}
              className={`
                min-h-[120px] p-2 border-r border-b border-white/5 flex flex-col group transition-all last:border-r-0
                ${inMonth ? 'bg-transparent' : 'bg-black/20 opacity-30'}
                ${active ? 'bg-primary-500/5' : 'hover:bg-white/[0.02]'}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`
                  text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg transition-all
                  ${active ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40' : inMonth ? 'text-slate-400 group-hover:text-white' : 'text-slate-600'}
                `}>
                  {format(day, 'd')}
                </span>
                
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all">
                  <Plus size={14} weight="bold" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5 overflow-hidden pb-1">
                {dayPieces.map(p => {
                  const plat = PLATFORM_ICONS[p.platform] || { Icon: InstagramLogo, color: 'text-slate-400', bg: 'bg-white/10' };
                  const Icon = plat.Icon;
                  return (
                    <div 
                      key={p.id}
                      className={`
                        flex items-center gap-2 p-1.5 rounded-lg border border-white/5 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all
                        ${plat.bg}
                      `}
                    >
                      <Icon size={12} className={plat.color} weight="fill" />
                      <span className="text-[10px] font-bold text-white/90 truncate leading-none">
                        {p.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
