import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Star,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/date';

export const DailyReviewModal: React.FC = () => {
  const {
    isDailyReviewOpen,
    setIsDailyReviewOpen,
    tasks,
    updateTask,
    saveDailyReview,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [movedToTomorrowIds, setMovedToTomorrowIds] = useState<string[]>([]);
  const [biggestAchievement, setBiggestAchievement] = useState('');
  const [gratitudeNotes, setGratitudeNotes] = useState('');
  const [energyRating, setEnergyRating] = useState<number>(5);

  const todayStr = getTodayDateString();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const todayTasks = tasks.filter((t) => t.dueDate <= todayStr);
  const completedTodayTasks = todayTasks.filter((t) => t.status === 'completed');
  const remainingTodayTasks = todayTasks.filter((t) => t.status !== 'completed');

  if (!isDailyReviewOpen) return null;

  const toggleMoveToTomorrow = (taskId: string) => {
    if (movedToTomorrowIds.includes(taskId)) {
      setMovedToTomorrowIds(movedToTomorrowIds.filter((id) => id !== taskId));
    } else {
      setMovedToTomorrowIds([...movedToTomorrowIds, taskId]);
    }
  };

  const handleFinishReview = () => {
    // Postpone chosen tasks to tomorrow
    movedToTomorrowIds.forEach((id) => {
      updateTask(id, { dueDate: tomorrowStr });
    });

    saveDailyReview({
      date: todayStr,
      completedTaskIds: completedTodayTasks.map((t) => t.id),
      remainingTaskIds: remainingTodayTasks.map((t) => t.id),
      movedToTomorrowIds,
      biggestAchievement: biggestAchievement.trim() || 'Completed essential priorities and protected deep work focus.',
      gratitudeOrLearnings: gratitudeNotes.trim() || undefined,
      energyRating,
    });

    setIsDailyReviewOpen(false);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 to-indigo-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Daily Review & Reflection
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Step {step} of 4 — Celebrate progress and reset for tomorrow
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDailyReviewOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: What did you complete? */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  1. What did you complete today?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  You accomplished {completedTodayTasks.length} task{completedTodayTasks.length !== 1 ? 's' : ''} today. Take pride in your forward momentum!
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {completedTodayTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No completed tasks logged today yet.
                  </p>
                ) : (
                  completedTodayTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center gap-2.5 text-xs text-emerald-950 font-semibold"
                    >
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 2: What remains? */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  2. What remains on your plate?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review incomplete items from today. You can select which to roll over to tomorrow.
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {remainingTodayTasks.length === 0 ? (
                  <p className="text-xs text-emerald-600 font-bold py-6 text-center">
                    🎉 Inbox Zero! All tasks scheduled for today are complete.
                  </p>
                ) : (
                  remainingTodayTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-semibold text-slate-800 truncate">
                        {t.title}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded font-bold uppercase text-slate-500 bg-white border border-slate-200">
                        {t.priority}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 3: What should move to tomorrow? */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  3. What should move to tomorrow?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select unfinished tasks you'd like FlowDesk to automatically postpone to tomorrow.
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {remainingTodayTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Nothing pending to roll over.
                  </p>
                ) : (
                  remainingTodayTasks.map((t) => {
                    const isSelected = movedToTomorrowIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleMoveToTomorrow(t.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-semibold ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{t.title}</span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isSelected ? 'Moving to Tomorrow' : 'Keep on Today'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Biggest achievement & Energy rating */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  4. What was your biggest achievement?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reflect on your most meaningful win today.
                </p>
              </div>

              <div>
                <textarea
                  rows={3}
                  value={biggestAchievement}
                  onChange={(e) => setBiggestAchievement(e.target.value)}
                  placeholder="e.g. Delivered the Google Ads Training PPT and closed client questions with 100% clarity!"
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Energy & Satisfaction Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEnergyRating(star)}
                      className={`p-2 rounded-xl transition-transform ${
                        star <= energyRating ? 'text-amber-500 scale-110' : 'text-slate-300'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 font-semibold ml-2">
                    {energyRating === 5 ? 'High Energy ⚡' : energyRating >= 3 ? 'Good Focus 👍' : 'Tiring Day 💤'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4)}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinishReview}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-200"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Complete Review</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
