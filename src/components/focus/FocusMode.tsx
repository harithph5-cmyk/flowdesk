import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Flame,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { startAmbientSound, stopAmbientSound, playSoftClick } from '../../utils/audio';

export const FocusMode: React.FC = () => {
  const {
    isFocusModeOpen,
    setIsFocusModeOpen,
    activeFocusTaskId,
    tasks,
    projects,
    completeFocusOnTask,
  } = useApp();

  const currentTask = tasks.find((t) => t.id === activeFocusTaskId) || tasks.find((t) => t.status !== 'completed');
  const project = projects.find((p) => p.id === currentTask?.projectId);

  // Timer states
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync initial task estimated duration or default
  useEffect(() => {
    if (currentTask?.estimatedDuration) {
      setInitialMinutes(currentTask.estimatedDuration);
      setSecondsRemaining(currentTask.estimatedDuration * 60);
    } else {
      setInitialMinutes(25);
      setSecondsRemaining(25 * 60);
    }
    setIsRunning(true);
    setShowCelebration(false);
  }, [activeFocusTaskId]);

  // Countdown loop
  useEffect(() => {
    if (!isFocusModeOpen) {
      stopAmbientSound();
      setIsAmbientOn(false);
      return;
    }

    if (isRunning && secondsRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      handleComplete();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, secondsRemaining, isFocusModeOpen]);

  // Handle ambient sound cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  if (!isFocusModeOpen) return null;

  const togglePause = () => {
    playSoftClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    playSoftClick();
    setIsRunning(false);
    setSecondsRemaining(initialMinutes * 60);
  };

  const handleSetDuration = (mins: number) => {
    playSoftClick();
    setInitialMinutes(mins);
    setSecondsRemaining(mins * 60);
    setIsRunning(true);
  };

  const toggleAmbient = () => {
    if (isAmbientOn) {
      stopAmbientSound();
      setIsAmbientOn(false);
    } else {
      startAmbientSound(0.18);
      setIsAmbientOn(true);
    }
  };

  const handleComplete = () => {
    if (!currentTask) return;
    setIsRunning(false);
    stopAmbientSound();
    setIsAmbientOn(false);
    setShowCelebration(true);

    const elapsedMinutes = Math.max(
      1,
      Math.round((initialMinutes * 60 - secondsRemaining) / 60)
    );
    completeFocusOnTask(currentTask.id, elapsedMinutes);

    setTimeout(() => {
      setShowCelebration(false);
      setIsFocusModeOpen(false);
    }, 2400);
  };

  const handleClose = () => {
    stopAmbientSound();
    setIsAmbientOn(false);
    setIsFocusModeOpen(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Format time
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressFraction = Math.max(
    0,
    Math.min(1, 1 - secondsRemaining / (initialMinutes * 60 || 1))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl text-white flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-200">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
            <Flame className="w-5 h-5 animate-pulse" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            FlowDesk Focus Mode
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleAmbient}
            className={`p-2.5 rounded-xl border transition-colors flex items-center gap-2 text-xs font-semibold ${
              isAmbientOn
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
            }`}
            title="Focus Rain / Ambient Sound"
          >
            {isAmbientOn ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isAmbientOn ? 'Ambient On' : 'Ambient Off'}
            </span>
          </button>

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Focus Centerpiece */}
      <div className="max-w-xl w-full mx-auto text-center space-y-8 my-auto relative">
        {showCelebration ? (
          <div className="py-12 space-y-4 animate-in zoom-in-75 duration-300">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
              <Sparkles className="w-10 h-10 animate-bounce" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Outstanding Work, Hari! 🎉
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Task completed and logged to your daily productivity metrics.
            </p>
          </div>
        ) : (
          <>
            {/* Task Title & Project Pill */}
            <div className="space-y-3">
              {project && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-white/10"
                  style={{
                    backgroundColor: `${project.color}30`,
                    color: project.color,
                  }}
                >
                  <span>{project.icon || '📁'}</span>
                  <span>{project.name}</span>
                </span>
              )}

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                🔥 {currentTask ? currentTask.title : 'Deep Focus Session'}
              </h2>

              {currentTask?.description && (
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  {currentTask.description}
                </p>
              )}
            </div>

            {/* Giant Countdown Clock */}
            <div className="relative py-4">
              <div className="font-mono text-7xl sm:text-9xl font-black tracking-tighter text-white tabular-nums drop-shadow-lg select-none">
                {formattedTime}
              </div>

              {/* Minimalist Progress Ring / Bar */}
              <div className="w-64 max-w-full mx-auto h-2 bg-white/10 rounded-full overflow-hidden mt-6">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progressFraction * 100}%` }}
                />
              </div>
            </div>

            {/* Controls: Pause / Resume & Complete */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={togglePause}
                className={`px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 ${
                  isRunning
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                onClick={handleComplete}
                className="px-7 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Complete Task</span>
              </button>

              <button
                onClick={handleReset}
                className="p-3.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl border border-white/10 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Duration Presets */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Presets:</span>
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSetDuration(mins)}
                  className={`px-3 py-1 rounded-xl font-semibold transition-colors ${
                    initialMinutes === mins
                      ? 'bg-white text-slate-900'
                      : 'bg-white/5 hover:bg-white/15 text-slate-400'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Zen Quote */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-500">
        “Clarity → Focus → Action → Progress”
      </div>
    </div>
  );
};
