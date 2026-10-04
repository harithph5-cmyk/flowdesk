import React, { useState, useRef } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Volume2,
  VolumeX,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsModal: React.FC = () => {
  const {
    user,
    updateUserProfile,
    resetToSampleData,
    exportAllData,
    importAllData,
    triggerConfetti,
  } = useApp();

  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title);
  const [workingHoursStart, setWorkingHoursStart] = useState(user.workingHoursStart);
  const [workingHoursEnd, setWorkingHoursEnd] = useState(user.workingHoursEnd);
  const [soundEnabled, setSoundEnabled] = useState(user.soundEnabled);
  const [focusDuration, setFocusDuration] = useState(user.focusDuration || 25);
  const [savedStatus, setSavedStatus] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      title,
      workingHoursStart,
      workingHoursEnd,
      soundEnabled,
      focusDuration,
    });
    setSavedStatus(true);
    triggerConfetti();
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllData(content);
      if (success) {
        setImportStatus('Data imported successfully!');
        triggerConfetti();
      } else {
        setImportStatus('Failed to import JSON file.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-slate-700" />
          <span>FlowDesk Settings & Preferences</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Customize your profile, daily focus duration, sound effects, and data storage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Personal Profile</h3>
          <div className="text-center space-y-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-2xl mx-auto object-cover ring-4 ring-indigo-100 shadow-sm"
            />
            <div>
              <p className="font-bold text-slate-900 text-base">{user.name}</p>
              <p className="text-xs text-slate-500">{user.title}</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>FlowDesk Active</span>
            </div>
          </div>
        </div>

        {/* Right Columns: Configuration Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h3 className="font-bold text-slate-900 text-sm">Workspace Settings</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Work Day Start
                </label>
                <input
                  type="time"
                  value={workingHoursStart}
                  onChange={(e) => setWorkingHoursStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Work Day End
                </label>
                <input
                  type="time"
                  value={workingHoursEnd}
                  onChange={(e) => setWorkingHoursEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Default Focus (Mins)
                </label>
                <input
                  type="number"
                  min={5}
                  max={90}
                  value={focusDuration}
                  onChange={(e) => setFocusDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Sound Effects & Completion Chime</p>
                  <p className="text-[11px] text-slate-500">Play pleasant audio feedback when finishing tasks</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded-lg accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {savedStatus && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Preferences Saved!
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </form>

          {/* Data Backup & Management */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Data Backup & Restore</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              FlowDesk saves all your tasks, timeline schedules, and notes securely in your browser's persistent localStorage. You can export a full JSON backup or restore anytime.
            </p>

            {importStatus && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800 font-semibold">
                {importStatus}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={exportAllData}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export Backup (JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
              >
                <Upload className="w-4 h-4" />
                <span>Restore from JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => {
                  if (confirm('Reset to initial realistic sample data? Any unsaved edits will be refreshed.')) {
                    resetToSampleData();
                    triggerConfetti();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors border border-rose-200 ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Sample Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
