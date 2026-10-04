import React from 'react';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  Play,
  Calendar,
  Coffee,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimelineBlock } from '../../types';

export const TimelineSection: React.FC = () => {
  const {
    timeline,
    setIsSmartPlanOpen,
    startFocusOnTask,
    tasks,
  } = useApp();

  const getColorClass = (colorType: TimelineBlock['colorType']) => {
    switch (colorType) {
      case 'green':
        return {
          bullet: 'bg-emerald-500 ring-emerald-100',
          line: 'border-emerald-200',
          card: 'bg-emerald-50/40 border-emerald-200/80 text-emerald-950',
          badge: 'bg-emerald-100 text-emerald-800',
        };
      case 'blue':
        return {
          bullet: 'bg-blue-500 ring-blue-100',
          line: 'border-blue-200',
          card: 'bg-blue-50/40 border-blue-200/80 text-blue-950',
          badge: 'bg-blue-100 text-blue-800',
        };
      case 'purple':
        return {
          bullet: 'bg-purple-500 ring-purple-100',
          line: 'border-purple-200',
          card: 'bg-purple-50/40 border-purple-200/80 text-purple-950',
          badge: 'bg-purple-100 text-purple-800',
        };
      case 'yellow':
        return {
          bullet: 'bg-amber-500 ring-amber-100',
          line: 'border-amber-200',
          card: 'bg-amber-50/40 border-amber-200/80 text-amber-950',
          badge: 'bg-amber-100 text-amber-800',
        };
      case 'orange':
        return {
          bullet: 'bg-orange-500 ring-orange-100',
          line: 'border-orange-200',
          card: 'bg-orange-50/40 border-orange-200/80 text-orange-950',
          badge: 'bg-orange-100 text-orange-800',
        };
      case 'red':
        return {
          bullet: 'bg-rose-500 ring-rose-100',
          line: 'border-rose-200',
          card: 'bg-rose-50/40 border-rose-200/80 text-rose-950',
          badge: 'bg-rose-100 text-rose-800',
        };
      case 'pink':
        return {
          bullet: 'bg-pink-500 ring-pink-100',
          line: 'border-pink-200',
          card: 'bg-pink-50/40 border-pink-200/80 text-pink-950',
          badge: 'bg-pink-100 text-pink-800',
        };
      case 'grey':
      default:
        return {
          bullet: 'bg-slate-400 ring-slate-100',
          line: 'border-slate-200',
          card: 'bg-slate-50 border-slate-200 text-slate-800',
          badge: 'bg-slate-100 text-slate-700',
        };
    }
  };

  const handleStartFocusForBlock = (block: TimelineBlock) => {
    // If there is an associated task or similar task by title, focus on it
    const matching = tasks.find(
      (t) => t.title.toLowerCase().includes(block.title.toLowerCase()) || block.title.toLowerCase().includes(t.title.toLowerCase())
    );
    if (matching) {
      startFocusOnTask(matching.id);
    } else {
      const active = tasks.find((t) => t.status !== 'completed');
      if (active) startFocusOnTask(active.id);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Timeline / My Day</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Today's time-blocked flow for high clarity and low friction
          </p>
        </div>

        <button
          onClick={() => setIsSmartPlanOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>✨ Plan My Day</span>
        </button>
      </div>

      {/* Visual Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {timeline.map((block) => {
          const style = getColorClass(block.colorType);

          return (
            <div key={block.id} className="relative group">
              {/* Bullet Node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-3 w-4 h-4 rounded-full ring-4 ${style.bullet} transition-transform group-hover:scale-125 z-10`}
              />

              {/* Block Card */}
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${style.card} hover:shadow-sm`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-800 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
                      {block.time}
                      {block.endTime ? ` – ${block.endTime}` : ''}
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {block.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {block.type === 'meeting' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800">
                        <Calendar className="w-3 h-3" />
                        <span>Meeting</span>
                      </span>
                    )}

                    {block.type === 'break' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-pink-100 text-pink-800">
                        <Coffee className="w-3 h-3" />
                        <span>Recharge</span>
                      </span>
                    )}

                    {block.type === 'task' && (
                      <button
                        onClick={() => handleStartFocusForBlock(block)}
                        className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 transition-all"
                        title="Start Focus on this block"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Focus</span>
                      </button>
                    )}
                  </div>
                </div>

                {block.detail && (
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed pl-1">
                    {block.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
