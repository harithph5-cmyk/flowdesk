import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  Meeting,
  Project,
  FocusSession,
  DailyReview,
  NoteIdea,
  NotificationItem,
  TimelineBlock,
  DailyPlanSchedule,
  Priority,
} from '../types';
import {
  STORAGE_KEYS,
  INITIAL_PROJECTS,
  INITIAL_TIMELINE,
  INITIAL_FOCUS_SESSIONS,
  INITIAL_NOTES,
  INITIAL_NOTIFICATIONS,
  DEFAULT_USER,
  getInitialTasks,
  getInitialMeetings,
  loadFromStorage,
  saveToStorage,
} from '../utils/storage';
import { playCompletionChime } from '../utils/audio';

export type NavTab = 'dashboard' | 'tasks' | 'calendar' | 'focus' | 'projects' | 'insights' | 'notes' | 'settings';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  tasks: Task[];
  meetings: Meeting[];
  projects: Project[];
  focusSessions: FocusSession[];
  dailyReviews: DailyReview[];
  notes: NoteIdea[];
  timeline: TimelineBlock[];
  notifications: NotificationItem[];
  user: typeof DEFAULT_USER;
  
  // Selection & Filters
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedPriority: Priority | null;
  setSelectedPriority: (p: Priority | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Active Focus
  activeFocusTaskId: string | null;
  setActiveFocusTaskId: (id: string | null) => void;
  isFocusModeOpen: boolean;
  setIsFocusModeOpen: (open: boolean) => void;
  startFocusOnTask: (taskId: string) => void;
  completeFocusOnTask: (taskId: string, durationMinutes: number) => void;

  // Modals & Panels
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isQuickCaptureOpen: boolean;
  setIsQuickCaptureOpen: (open: boolean) => void;
  quickCaptureTab: 'task' | 'meeting' | 'note' | 'idea';
  setQuickCaptureTab: (t: 'task' | 'meeting' | 'note' | 'idea') => void;
  isDailyReviewOpen: boolean;
  setIsDailyReviewOpen: (open: boolean) => void;
  isSmartPlanOpen: boolean;
  setIsSmartPlanOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;

  // Edit Modals
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  selectedTaskForEdit: Task | null;
  setSelectedTaskForEdit: (task: Task | null) => void;

  isMeetingModalOpen: boolean;
  setIsMeetingModalOpen: (open: boolean) => void;
  selectedMeetingForEdit: Meeting | null;
  setSelectedMeetingForEdit: (meeting: Meeting | null) => void;

  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;

  // CRUD Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;

  addMeeting: (meeting: Omit<Meeting, 'id'>) => Meeting;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;

  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addNote: (note: Omit<NoteIdea, 'id' | 'createdAt' | 'updatedAt'>) => NoteIdea;
  updateNote: (id: string, updates: Partial<NoteIdea>) => void;
  deleteNote: (id: string) => void;

  saveDailyReview: (review: Omit<DailyReview, 'id' | 'savedAt'>) => void;
  applySmartPlanToTimeline: (schedule: DailyPlanSchedule) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;

  updateUserProfile: (updates: Partial<typeof DEFAULT_USER>) => void;
  resetToSampleData: () => void;
  exportAllData: () => void;
  importAllData: (jsonStr: string) => boolean;

  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage(STORAGE_KEYS.TASKS, getInitialTasks())
  );
  const [meetings, setMeetings] = useState<Meeting[]>(() =>
    loadFromStorage(STORAGE_KEYS.MEETINGS, getInitialMeetings())
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    loadFromStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS)
  );
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() =>
    loadFromStorage(STORAGE_KEYS.FOCUS_SESSIONS, INITIAL_FOCUS_SESSIONS)
  );
  const [dailyReviews, setDailyReviews] = useState<DailyReview[]>(() =>
    loadFromStorage(STORAGE_KEYS.DAILY_REVIEWS, [])
  );
  const [notes, setNotes] = useState<NoteIdea[]>(() =>
    loadFromStorage(STORAGE_KEYS.NOTES, INITIAL_NOTES)
  );
  const [timeline, setTimeline] = useState<TimelineBlock[]>(() =>
    loadFromStorage(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );
  const [user, setUser] = useState(() =>
    loadFromStorage(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER)
  );

  // Filters & Search
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Focus
  const [activeFocusTaskId, setActiveFocusTaskId] = useState<string | null>('task-1');
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

  // Modals & Panels
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [quickCaptureTab, setQuickCaptureTab] = useState<'task' | 'meeting' | 'note' | 'idea'>('task');
  const [isDailyReviewOpen, setIsDailyReviewOpen] = useState(false);
  const [isSmartPlanOpen, setIsSmartPlanOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Edit Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);

  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedMeetingForEdit, setSelectedMeetingForEdit] = useState<Meeting | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => { saveToStorage(STORAGE_KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.MEETINGS, meetings); }, [meetings]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.PROJECTS, projects); }, [projects]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.FOCUS_SESSIONS, focusSessions); }, [focusSessions]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.DAILY_REVIEWS, dailyReviews); }, [dailyReviews]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.NOTES, notes); }, [notes]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TIMELINE, timeline); }, [timeline]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.USER_PROFILE, user); }, [user]);

  // Keyboard shortcut listener (Cmd/Ctrl + K for search, Cmd/Ctrl + J for quick capture)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsQuickCaptureOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#3b82f6', '#10b981', '#a855f7', '#f97316', '#eab308'],
      });
    } catch (e) {
      console.debug('Confetti error', e);
    }
  };

  const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'order'>): Task => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      order: tasks.length + 1,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const toggleTaskStatus = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const isNowCompleted = target.status !== 'completed';
    const updatedStatus = isNowCompleted ? 'completed' : 'todo';
    const completedAt = isNowCompleted ? new Date().toISOString() : undefined;

    if (isNowCompleted) {
      if (user.soundEnabled) playCompletionChime();
      triggerConfetti();
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: updatedStatus, completedAt } : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeFocusTaskId === id) {
      const remaining = tasks.filter((t) => t.id !== id && t.status !== 'completed');
      setActiveFocusTaskId(remaining[0]?.id || null);
    }
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const addMeeting = (newMeetingData: Omit<Meeting, 'id'>): Meeting => {
    const newMeeting: Meeting = {
      ...newMeetingData,
      id: `meet-${Date.now()}`,
    };
    setMeetings((prev) => [...prev, newMeeting]);
    return newMeeting;
  };

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  const addProject = (projData: Omit<Project, 'id' | 'createdAt'>): Project => {
    const newProj: Project = {
      ...projData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProj]);
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProjectId === id) setSelectedProjectId(null);
  };

  const addNote = (noteData: Omit<NoteIdea, 'id' | 'createdAt' | 'updatedAt'>): NoteIdea => {
    const newNote: NoteIdea = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<NoteIdea>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const startFocusOnTask = (taskId: string) => {
    setActiveFocusTaskId(taskId);
    setIsFocusModeOpen(true);
  };

  const completeFocusOnTask = (taskId: string, durationMinutes: number) => {
    const task = tasks.find((t) => t.id === taskId);
    toggleTaskStatus(taskId);
    
    // Log focus session
    const session: FocusSession = {
      id: `f-${Date.now()}`,
      taskId,
      taskTitle: task?.title || 'Focused Task',
      startTime: new Date(Date.now() - durationMinutes * 60000).toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes,
      completed: true,
    };
    setFocusSessions((prev) => [session, ...prev]);
  };

  const saveDailyReview = (reviewData: Omit<DailyReview, 'id' | 'savedAt'>) => {
    const review: DailyReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    setDailyReviews((prev) => [review, ...prev]);
    triggerConfetti();
  };

  const applySmartPlanToTimeline = (schedule: DailyPlanSchedule) => {
    const newBlocks: TimelineBlock[] = schedule.blocks.map((b, idx) => ({
      id: `plan-block-${idx}-${Date.now()}`,
      time: b.startTime,
      endTime: b.endTime,
      title: b.title,
      type: b.type,
      colorType: b.colorType,
      detail: b.reason,
      completed: false,
    }));
    setTimeline(newBlocks);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const updateUserProfile = (updates: Partial<typeof DEFAULT_USER>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const resetToSampleData = () => {
    setTasks(getInitialTasks());
    setMeetings(getInitialMeetings());
    setProjects(INITIAL_PROJECTS);
    setFocusSessions(INITIAL_FOCUS_SESSIONS);
    setNotes(INITIAL_NOTES);
    setTimeline(INITIAL_TIMELINE);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUser(DEFAULT_USER);
  };

  const exportAllData = () => {
    const data = {
      user,
      tasks,
      meetings,
      projects,
      focusSessions,
      dailyReviews,
      notes,
      timeline,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowdesk-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importAllData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.tasks) setTasks(data.tasks);
      if (data.meetings) setMeetings(data.meetings);
      if (data.projects) setProjects(data.projects);
      if (data.focusSessions) setFocusSessions(data.focusSessions);
      if (data.dailyReviews) setDailyReviews(data.dailyReviews);
      if (data.notes) setNotes(data.notes);
      if (data.timeline) setTimeline(data.timeline);
      if (data.user) setUser(data.user);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tasks,
        meetings,
        projects,
        focusSessions,
        dailyReviews,
        notes,
        timeline,
        notifications,
        user,
        selectedProjectId,
        setSelectedProjectId,
        selectedPriority,
        setSelectedPriority,
        searchQuery,
        setSearchQuery,
        activeFocusTaskId,
        setActiveFocusTaskId,
        isFocusModeOpen,
        setIsFocusModeOpen,
        startFocusOnTask,
        completeFocusOnTask,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isQuickCaptureOpen,
        setIsQuickCaptureOpen,
        quickCaptureTab,
        setQuickCaptureTab,
        isDailyReviewOpen,
        setIsDailyReviewOpen,
        isSmartPlanOpen,
        setIsSmartPlanOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isTaskModalOpen,
        setIsTaskModalOpen,
        selectedTaskForEdit,
        setSelectedTaskForEdit,
        isMeetingModalOpen,
        setIsMeetingModalOpen,
        selectedMeetingForEdit,
        setSelectedMeetingForEdit,
        isProjectModalOpen,
        setIsProjectModalOpen,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        reorderTasks,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        addProject,
        updateProject,
        deleteProject,
        addNote,
        updateNote,
        deleteNote,
        saveDailyReview,
        applySmartPlanToTimeline,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        updateUserProfile,
        resetToSampleData,
        exportAllData,
        importAllData,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
