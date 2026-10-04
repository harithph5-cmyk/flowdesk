import React, { useState } from 'react';
import {
  Plus,
  CheckSquare,
  Calendar,
  StickyNote,
  Lightbulb,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/date';

export const QuickCaptureFab: React.FC = () => {
  const {
    isQuickCaptureOpen,
    setIsQuickCaptureOpen,
    quickCaptureTab,
    setQuickCaptureTab,
    addTask,
    addMeeting,
    addNote,
    projects,
    triggerConfetti,
  } = useApp();

  const [isOpenMenu, setIsOpenMenu] = useState(false);

  // Form states inside quick modal
  const [taskTitle, setTaskTitle] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingClient, setMeetingClient] = useState('');
  const [meetingTime, setMeetingTime] = useState('11:00');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const handleOpenAction = (tab: 'task' | 'meeting' | 'note' | 'idea') => {
    setQuickCaptureTab(tab);
    setIsQuickCaptureOpen(true);
    setIsOpenMenu(false);
  };

  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle.trim(),
      status: 'todo',
      priority: 'high',
      projectId: projects[0]?.id || 'proj-codelytix',
      dueDate: getTodayDateString(),
      tags: ['quick-capture'],
      estimatedDuration: 30,
    });
    setTaskTitle('');
    setIsQuickCaptureOpen(false);
    triggerConfetti();
  };

  const handleQuickMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) return;
    addMeeting({
      title: meetingTitle.trim(),
      date: getTodayDateString(),
      startTime: meetingTime,
      endTime: '11:45',
      duration: 45,
      client: meetingClient.trim() || undefined,
      meetingType: 'virtual',
      meetingLink: 'https://meet.google.com/new',
    });
    setMeetingTitle('');
    setMeetingClient('');
    setIsQuickCaptureOpen(false);
    triggerConfetti();
  };

  const handleQuickNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    addNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      type: quickCaptureTab === 'idea' ? 'idea' : 'note',
      tags: [quickCaptureTab],
      color: quickCaptureTab === 'idea' ? '#8b5cf6' : '#3b82f6',
    });
    setNoteTitle('');
    setNoteContent('');
    setIsQuickCaptureOpen(false);
    triggerConfetti();
  };

  return (
    <>
      {/* Floating Speed Dial FAB (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {isOpenMenu && (
          <div className="space-y-2 mb-1 animate-in slide-in-from-bottom-2 fade-in duration-150">
            <button
              onClick={() => handleOpenAction('idea')}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-purple-700 font-bold text-xs rounded-2xl shadow-lg border border-purple-100 hover:bg-purple-50 transition-all"
            >
              <Lightbulb className="w-4 h-4 text-purple-600" />
              <span>Capture Idea</span>
            </button>

            <button
              onClick={() => handleOpenAction('note')}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-blue-700 font-bold text-xs rounded-2xl shadow-lg border border-blue-100 hover:bg-blue-50 transition-all"
            >
              <StickyNote className="w-4 h-4 text-blue-600" />
              <span>Add Note</span>
            </button>

            <button
              onClick={() => handleOpenAction('meeting')}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-amber-700 font-bold text-xs rounded-2xl shadow-lg border border-amber-100 hover:bg-amber-50 transition-all"
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Add Meeting</span>
            </button>

            <button
              onClick={() => handleOpenAction('task')}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-indigo-700 font-bold text-xs rounded-2xl shadow-lg border border-indigo-100 hover:bg-indigo-50 transition-all"
            >
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>Add Task</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-200 active:scale-95 ${
            isOpenMenu
              ? 'bg-slate-800 rotate-45'
              : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:shadow-indigo-500/40 hover:scale-105'
          }`}
          title="Quick Capture (< 5 seconds)"
          aria-label="Quick Capture"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Quick Capture Modal Dialog */}
      {isQuickCaptureOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Tabs */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setQuickCaptureTab('task')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    quickCaptureTab === 'task'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Task
                </button>
                <button
                  onClick={() => setQuickCaptureTab('meeting')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    quickCaptureTab === 'meeting'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Meeting
                </button>
                <button
                  onClick={() => setQuickCaptureTab('note')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    quickCaptureTab === 'note'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Note
                </button>
                <button
                  onClick={() => setQuickCaptureTab('idea')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    quickCaptureTab === 'idea'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Idea
                </button>
              </div>

              <button
                onClick={() => setIsQuickCaptureOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {quickCaptureTab === 'task' && (
                <form onSubmit={handleQuickTaskSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Task Title
                    </label>
                    <input
                      type="text"
                      autoFocus
                      required
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="e.g. Follow up on Beyond Books launch"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Save Task (Instant)
                  </button>
                </form>
              )}

              {quickCaptureTab === 'meeting' && (
                <form onSubmit={handleQuickMeetingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Meeting Title
                    </label>
                    <input
                      type="text"
                      autoFocus
                      required
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      placeholder="e.g. Sync with Royal Hardwares"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Client / Partner
                      </label>
                      <input
                        type="text"
                        value={meetingClient}
                        onChange={(e) => setMeetingClient(e.target.value)}
                        placeholder="Company name"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Schedule Meeting
                  </button>
                </form>
              )}

              {(quickCaptureTab === 'note' || quickCaptureTab === 'idea') && (
                <form onSubmit={handleQuickNoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {quickCaptureTab === 'idea' ? 'Idea Headline' : 'Note Title'}
                    </label>
                    <input
                      type="text"
                      autoFocus
                      required
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder={quickCaptureTab === 'idea' ? 'Spark of inspiration...' : 'Quick reference...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Details
                    </label>
                    <textarea
                      rows={3}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Write your thought down before you forget..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Save {quickCaptureTab === 'idea' ? 'Idea' : 'Note'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
