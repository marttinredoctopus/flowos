'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths,
} from 'date-fns';
import { contentApi } from '@/lib/api';
import PostModal from './PostModal';
import type { ContentPost, CalendarView } from '@/types/content';

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-pink-100 text-pink-700 border-pink-200',
  twitter:   'bg-sky-100 text-sky-700 border-sky-200',
  facebook:  'bg-blue-100 text-blue-700 border-blue-200',
  linkedin:  'bg-indigo-100 text-indigo-700 border-indigo-200',
  tiktok:    'bg-gray-100 text-gray-700 border-gray-200',
  youtube:   'bg-red-100 text-red-700 border-red-200',
};

const STATUS_DOT: Record<string, string> = {
  draft:     'bg-yellow-400',
  scheduled: 'bg-blue-400',
  published: 'bg-green-400',
};

export default function ContentCalendar() {
  const [current, setCurrent] = useState(new Date());
  const [calData, setCalData] = useState<CalendarView | null>(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    post?: ContentPost | null;
    defaultDate?: Date;
  }>({ open: false });

  const load = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const data = await contentApi.calendar(date.getFullYear(), date.getMonth() + 1);
      setCalData(data);
    } catch {
      // keep previous data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(current); }, [current, load]);

  const start = startOfWeek(startOfMonth(current), { weekStartsOn: 1 });
  const end   = endOfWeek(endOfMonth(current), { weekStartsOn: 1 });
  const days  = eachDayOfInterval({ start, end });

  const postsForDay = (day: Date): ContentPost[] =>
    calData?.byDay[day.getDate()] ?? [];

  const handleSaved = (post: ContentPost) => {
    setModal({ open: false });
    load(current);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await contentApi.delete(id);
    load(current);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrent((d) => subMonths(d, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ‹
          </button>
          <h2 className="text-xl font-semibold w-44 text-center">
            {format(current, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrent((d) => addMonths(d, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ›
          </button>
          <button
            onClick={() => setCurrent(new Date())}
            className="text-sm px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Today
          </button>
        </div>

        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
        >
          <span className="text-lg leading-none">+</span> New post
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-3 text-xs text-gray-500">
        {Object.entries(STATUS_DOT).map(([s, cls]) => (
          <span key={s} className="flex items-center gap-1">
            <span className={`inline-block w-2 h-2 rounded-full ${cls}`} />
            {s}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={`flex-1 transition-opacity ${loading ? 'opacity-50' : ''}`}>
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const posts = postsForDay(day);
            const inMonth = isSameMonth(day, current);
            const today = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[100px] rounded-xl border p-2 flex flex-col
                  ${inMonth ? 'bg-white border-gray-100' : 'bg-gray-50 border-transparent'}
                  ${today ? 'border-primary-300 ring-1 ring-primary-200' : ''}
                  hover:border-primary-200 transition-colors
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                    ${today ? 'bg-primary-600 text-white' : inMonth ? 'text-gray-700' : 'text-gray-300'}`}>
                    {format(day, 'd')}
                  </span>
                  <button
                    onClick={() => setModal({ open: true, defaultDate: day })}
                    className="text-gray-300 hover:text-primary-500 text-lg leading-none opacity-0 group-hover:opacity-100"
                    title="Add post"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                  {posts.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setModal({ open: true, post: p })}
                      className={`
                        w-full text-left text-xs px-1.5 py-0.5 rounded border truncate
                        ${PLATFORM_COLORS[p.platform] ?? 'bg-gray-100 text-gray-700 border-gray-200'}
                      `}
                      title={p.title}
                    >
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${STATUS_DOT[p.status]}`} />
                      {p.title}
                    </button>
                  ))}
                  {posts.length > 3 && (
                    <span className="text-xs text-gray-400 pl-1">+{posts.length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <PostModal
          post={modal.post}
          defaultDate={modal.defaultDate}
          onClose={() => setModal({ open: false })}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
