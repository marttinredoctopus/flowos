'use client';

import { useState } from 'react';
import { 
  Plus, 
  DotsThreeVertical,
  CalendarDots,
  ChatCircleText,
  CheckCircle,
  Eye,
  Warning,
  Rocket,
  FileText,
  PaintBrush
} from '@phosphor-icons/react';
import { format } from 'date-fns';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const STATUSES = ['draft', 'writing', 'design', 'review', 'approved', 'scheduled', 'published'] as const;
type Status = typeof STATUSES[number];

const STATUS_ICONS: Record<Status, { Icon: any, color: string, bg: string, label: string }> = {
  draft:     { Icon: ChatCircleText,  color: 'text-slate-400',  bg: 'bg-slate-500/10',  label: 'Draft' },
  writing:   { Icon: FileText,        color: 'text-blue-400',   bg: 'bg-blue-500/10',   label: 'Writing' },
  design:    { Icon: PaintBrush,      color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Design' },
  review:    { Icon: Eye,             color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Review' },
  approved:  { Icon: CheckCircle,     color: 'text-emerald-400',bg: 'bg-emerald-500/10',label: 'Approved' },
  scheduled: { Icon: CalendarDots,    color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   label: 'Scheduled' },
  published: { Icon: Rocket,          color: 'text-primary-400', bg: 'bg-primary-500/10',label: 'Published' },
};


export default function ContentPipeline({ pieces, onUpdate }: { pieces: any[], onUpdate: () => void }) {
  const [moving, setMoving] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setMoving(id);
    try {
      await apiClient.patch(`/content-pieces/${id}`, { status });
      onUpdate();
      toast.success(`Moved to ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setMoving(null);
    }
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 h-full custom-scrollbar-h min-h-[600px]">
      {STATUSES.map(status => {
        const columnPieces = pieces.filter(p => p.status === status);
        const { Icon, color, bg, label } = STATUS_ICONS[status];
        
        return (
          <div key={status} className="flex-shrink-0 w-80 flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/[0.04]">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={16} className={color} weight="bold" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white tracking-tight">{label}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                    {columnPieces.length} Content
                  </span>
                </div>
              </div>
              
              <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 transition-all">
                <Plus size={16} weight="bold" />
              </button>
            </div>

            {/* Column Pieces */}
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
              {columnPieces.map(p => (
                <div 
                  key={p.id}
                  className={`
                    group bg-[#0d0d14] border border-white/5 rounded-xl p-4 shadow-xl transition-all hover:shadow-black/50 hover:border-primary-500/30 hover:-translate-y-0.5
                    ${moving === p.id ? 'opacity-50 pointer-events-none grayscale' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className={`px-2 py-1 rounded-md bg-white/5 border border-white/5 ${p.platform === 'instagram' ? 'text-pink-400 border-pink-500/20 bg-pink-500/5' : ''}`}>
                      {p.platform}
                    </span>
                    <span>{p.content_type}</span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-primary-300 transition-colors">
                    {p.title}
                  </h3>
                  
                  {p.publish_at && (
                    <div className="flex items-center gap-2 mb-4 text-[11px] text-slate-400 font-medium">
                      <CalendarDots size={14} weight="bold" />
                      {format(new Date(p.publish_at), 'MMM d, h:mm a')}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex -space-x-2">
                       {/* Placeholder for avatars */}
                       <div className="w-6 h-6 rounded-full bg-primary-600/20 border border-white/10 flex items-center justify-center text-[8px] font-bold text-primary-400 shadow-inner">
                         {p.assigned_writer_name?.[0] || 'W'}
                       </div>
                       <div className="w-6 h-6 rounded-full bg-cyan-600/20 border border-white/10 flex items-center justify-center text-[8px] font-bold text-cyan-400 shadow-inner">
                         {p.assigned_designer_name?.[0] || 'D'}
                       </div>
                    </div>

                    <div className="relative group/select">
                      <select 
                        value={p.status} 
                        onChange={e => updateStatus(p.id, e.target.value)}
                        className="bg-transparent text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer transition-all outline-none appearance-none pr-4"
                      >
                        {STATUSES.map(s => <option key={s} value={s} className="bg-[#0d0d14]">{s}</option>)}
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover/select:opacity-100 transition-all">
                        <CaretDown size={8} weight="bold" className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {columnPieces.length === 0 && (
                <div className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-slate-600 animate-pulse">
                  <span className="text-[10px] font-bold uppercase tracking-widest">No Content</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CaretDown({ size, weight, className }: { size: number, weight: string, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
      <path fill="currentColor" d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}
