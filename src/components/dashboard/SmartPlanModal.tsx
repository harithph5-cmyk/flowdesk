import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateSmartDailyPlan } from '../../utils/aiParser';
import { DailyPlanSchedule } from '../../types';

export const SmartPlanModal: React.FC = () => {
  const {
    isSmartPlanOpen,
    setIsSmartPlanOpen,
    tasks,
    meetings,
    projects,
    applySmartPlanToTimeline,
    triggerConfetti,
  } = useApp();

  const [schedule, setSchedule] = useState<DailyPlanSchedule | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (isSmartPlanOpen) {
      handleGenerate();
    }
  }, [isSmartPlanOpen]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setApplied(false);
    setTimeout(() => {
      const generated = generateSmartDailyPlan(tasks, meetings, projects);
      setSchedule(generated);
      setIsGenerating(false);
    }, 400);
  };

  if (!isSmartPlanOpen) return null;

  const handleApply = () => {
    if (schedule) {
      applySmartPlanToTimeline(schedule);
      setApplied(true);
      triggerConfetti();
      setTimeout(() => {
        setIsSmartPlanOpen(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 to-purple-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                AI Smart Daily Plan
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Optimized time blocks based on your workload & energy
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSmartPlanOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isGenerating ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                Analyzing priorities, deadlines & meeting schedules...
              </p>
              <p className="text-xs text-slate-400">
                Synthesizing realistic focus blocks and recovery breaks
              </p>
            </div>
          ) : schedule ? (
            <>
              <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>{schedule.summary}</span>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recommended Schedule
                </span>

                {schedule.blocks.map((block, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {block.startTime} – {block.endTime}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {block.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-1 leading-normal">
                        💡 {block.reason}
                      </p>
                    </div>

                    <div className="shrink-0 self-start sm:self-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          block.type === 'meeting'
                            ? 'bg-amber-100 text-amber-800'
                            : block.type === 'break'
                            ? 'bg-pink-100 text-pink-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {block.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSmartPlanOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleApply}
              disabled={isGenerating || applied}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 rounded-xl transition-all shadow-sm shadow-indigo-200"
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Applied to Timeline!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Apply to My Day</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
