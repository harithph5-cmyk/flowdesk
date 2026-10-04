import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  X,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getGreeting, formatFullDate } from '../../utils/date';

interface NavbarProps {
  onToggleSidebarMobile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebarMobile }) => {
  const {
    user,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    setIsCommandPaletteOpen,
    setIsQuickCaptureOpen,
    setQuickCaptureTab,
    setIsSmartPlanOpen,
    setIsAIAssistantOpen,
    setIsDailyReviewOpen,
    startFocusOnTask,
    activeFocusTaskId,
    tasks,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const greetingInfo = getGreeting(user.name);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentFocusTask = tasks.find((t) => t.id === activeFocusTaskId) || tasks.find((t) => t.status !== 'completed');

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebarMobile}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{greetingInfo.greeting}</span>
                <span className="animate-bounce inline-block text-xl">👋</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {formatFullDate()}
            </p>
          </div>
        </div>

        {/* Center: Search / Command Palette Trigger */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span className="text-slate-500 font-normal">Search tasks, meetings, projects...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-xs">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, AI, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Plan My Day AI Button */}
          <button
            onClick={() => setIsSmartPlanOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-all shadow-xs hover:shadow-indigo-100"
            title="Smart AI Daily Schedule"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Plan My Day</span>
          </button>

          {/* AI Assistant Chat Trigger */}
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl transition-all shadow-xs"
            title="FlowDesk AI Assistant"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
            </span>
            <span className="hidden xs:inline">FlowDesk AI</span>
          </button>

          {/* Quick Focus Button */}
          {currentFocusTask && (
            <button
              onClick={() => startFocusOnTask(currentFocusTask.id)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all"
              title="Start Focus Timer"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>Focus</span>
            </button>
          )}

          {/* Daily Review Button */}
          <button
            onClick={() => setIsDailyReviewOpen(true)}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
            title="Daily Review"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Daily Review</span>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={() => {
              setQuickCaptureTab('task');
              setIsQuickCaptureOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl transition-all shadow-sm shadow-indigo-200"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/80 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[11px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      No notifications right now
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 relative group ${
                          !item.read ? 'bg-indigo-50/30' : ''
                        }`}
                        onClick={() => markNotificationRead(item.id)}
                      >
                        <div className="mt-0.5">
                          {item.type === 'meeting' && (
                            <Calendar className="w-4 h-4 text-amber-500" />
                          )}
                          {item.type === 'warning' && (
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                          )}
                          {item.type === 'success' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                          {item.type === 'info' && (
                            <Sparkles className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 inline-block">{item.time}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 p-1 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="hidden 2xl:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Flow Mode On</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
