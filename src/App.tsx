import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { TaskBoard } from './components/tasks/TaskBoard';
import { CalendarView } from './components/calendar/CalendarView';
import { ProjectsHub } from './components/projects/ProjectsHub';
import { ProductivityInsights } from './components/insights/ProductivityInsights';
import { NotesHub } from './components/notes/NotesHub';
import { SettingsModal } from './components/settings/SettingsModal';
import { FocusMode } from './components/focus/FocusMode';
import { DailyReviewModal } from './components/review/DailyReviewModal';
import { SmartPlanModal } from './components/dashboard/SmartPlanModal';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer';
import { CommandPalette } from './components/layout/CommandPalette';
import { QuickCaptureFab } from './components/capture/QuickCaptureFab';
import { TaskModal } from './components/tasks/TaskModal';
import { MeetingModal } from './components/calendar/MeetingModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsFocusModeOpen } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'focus') {
      setIsFocusModeOpen(true);
      setActiveTab('dashboard');
    }
  }, [activeTab, setIsFocusModeOpen, setActiveTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 14. Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* 1. Top Header */}
        <Navbar onToggleSidebarMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        {/* Content View Router */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 transition-all">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'tasks' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
              <TaskBoard />
            </div>
          )}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'focus' && (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-lg mx-auto space-y-4">
              <p className="text-sm font-semibold text-slate-700">
                Ready for deep concentration?
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById('launch-focus');
                  if (el) el.click();
                }}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-bold rounded-2xl shadow-md"
              >
                Launch Focus Mode Screen
              </button>
            </div>
          )}
          {activeTab === 'projects' && <ProjectsHub />}
          {activeTab === 'insights' && <ProductivityInsights />}
          {activeTab === 'notes' && <NotesHub />}
          {activeTab === 'settings' && <SettingsModal />}
        </main>
      </div>

      {/* Global Modals, Drawers & Overlays */}
      <FocusMode />
      <DailyReviewModal />
      <SmartPlanModal />
      <AIAssistantDrawer />
      <CommandPalette />
      <QuickCaptureFab />
      <TaskModal />
      <MeetingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
