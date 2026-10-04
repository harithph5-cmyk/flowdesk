import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Flame,
  FolderGit2,
  BarChart3,
  StickyNote,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/date';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    tasks,
    meetings,
    projects,
    setIsSmartPlanOpen,
    startFocusOnTask,
    activeFocusTaskId,
  } = useApp();

  const todayStr = getTodayDateString();
  const todayTasks = tasks.filter((t) => t.dueDate <= todayStr && t.status !== 'completed');
  const todayMeetings = meetings.filter((m) => m.date === todayStr);

  // Overall today's completion stats for sidebar footer
  const totalTodayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const completedTodayTasks = totalTodayTasks.filter((t) => t.status === 'completed');
  const completionPercent = totalTodayTasks.length > 0
    ? Math.round((completedTodayTasks.length / totalTodayTasks.length) * 100)
    : 0;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: todayTasks.length > 0 ? todayTasks.length : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar className="w-5 h-5" />,
      badge: todayMeetings.length > 0 ? todayMeetings.length : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'focus',
      label: 'Focus Mode',
      icon: <Flame className="w-5 h-5 text-rose-500" />,
      badge: 'Timer',
      badgeColor: 'bg-rose-100 text-rose-700 font-semibold',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderGit2 className="w-5 h-5" />,
      badge: projects.length,
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'notes',
      label: 'Notes & Ideas',
      icon: <StickyNote className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar (Desktop fixed left, Mobile off-canvas) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between z-40 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* App Branding */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Zap className="w-5 h-5 fill-current stroke-none" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                FlowDesk
              </span>
              <span className="text-[10px] block font-semibold uppercase tracking-wider text-indigo-500 -mt-0.5">
                Command Centre
              </span>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace
          </p>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick AI Trigger Card */}
          <div className="pt-4 mt-2">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-blue-50/80 border border-indigo-100/70">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold mb-1">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Productivity</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Analyze your tasks and get a time-blocked schedule.
              </p>
              <button
                onClick={() => setIsSmartPlanOpen(true)}
                className="w-full py-2 px-3 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>✨ Plan My Day</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Daily Progress & Current Focus */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-600">Daily Completion</span>
            <span className="font-bold text-indigo-600">
              {completedTodayTasks.length}/{totalTodayTasks.length} ({completionPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          {activeFocusTaskId && (
            <button
              onClick={() => startFocusOnTask(activeFocusTaskId)}
              className="mt-3 w-full py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>Resume Focus</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium relative ${
            activeTab === 'tasks' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          {todayTasks.length > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
          )}
          <span className="text-[10px] mt-0.5">Tasks</span>
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'calendar' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Calendar</span>
        </button>
        <button
          onClick={() => {
            const task = tasks.find((t) => t.id === activeFocusTaskId) || tasks.find((t) => t.status !== 'completed');
            if (task) startFocusOnTask(task.id);
            else setActiveTab('focus');
          }}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'focus' ? 'text-rose-600' : 'text-slate-500'
          }`}
        >
          <Flame className="w-5 h-5 text-rose-500" />
          <span className="text-[10px] mt-0.5">Focus</span>
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'projects' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <FolderGit2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Projects</span>
        </button>
      </nav>
    </>
  );
};
