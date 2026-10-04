import React from 'react';
import { TodayFocus } from './TodayFocus';
import { QuickTaskInput } from './QuickTaskInput';
import { TaskBoard } from '../tasks/TaskBoard';
import { TimelineSection } from './TimelineSection';
import { MeetingCard } from '../calendar/MeetingCard';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, formatTime12 } from '../../utils/date';
import { Calendar as CalendarIcon, Plus, ArrowRight, FolderGit2 } from 'lucide-react';
import { Meeting } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    meetings,
    projects,
    tasks,
    setActiveTab,
    setIsMeetingModalOpen,
    setSelectedMeetingForEdit,
  } = useApp();

  const todayStr = getTodayDateString();
  const todayMeetings = meetings.filter((m) => m.date === todayStr);

  const handleEditMeeting = (m: Meeting) => {
    setSelectedMeetingForEdit(m);
    setIsMeetingModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 2. TODAY'S FOCUS (Large prominent hero section) */}
      <TodayFocus />

      {/* 3. QUICK TASK INPUT ("What are you working on?") */}
      <QuickTaskInput />

      {/* Two-Column SaaS Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 4. TASK BOARD (Today, Upcoming, Overdue, Completed) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
            <TaskBoard />
          </div>
        </div>

        {/* Right Column: 6. TIMELINE / MY DAY & MEETINGS */}
        <div className="lg:col-span-5 space-y-6">
          {/* 6. TIMELINE / MY DAY */}
          <TimelineSection />

          {/* 5. TODAY'S MEETINGS & CALENDAR SNIPPET */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  Today's Meetings
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedMeetingForEdit(null);
                    setIsMeetingModalOpen(true);
                  }}
                  className="p-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Add meeting"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add</span>
                </button>

                <button
                  onClick={() => setActiveTab('calendar')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 ml-1"
                >
                  <span>All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {todayMeetings.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No meetings scheduled for today
              </p>
            ) : (
              <div className="space-y-3">
                {todayMeetings.map((m) => (
                  <MeetingCard key={m.id} meeting={m} onEdit={handleEditMeeting} />
                ))}
              </div>
            )}
          </div>

          {/* 7. PROJECTS PROGRESS GLANCE */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Projects Activity
                </h3>
              </div>

              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 4).map((proj) => {
                const projTasks = tasks.filter((t) => t.projectId === proj.id);
                const active = projTasks.filter((t) => t.status !== 'completed').length;
                const done = projTasks.filter((t) => t.status === 'completed').length;
                const total = projTasks.length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                  <div key={proj.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <span>{proj.icon || '📁'}</span>
                        <span>{proj.name}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {active} active · {done} done ({pct}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: proj.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
