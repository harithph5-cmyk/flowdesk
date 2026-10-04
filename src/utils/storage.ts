import { Task, Meeting, Project, FocusSession, DailyReview, NoteIdea, NotificationItem, TimelineBlock } from '../types';
import { getTodayDateString } from './date';

const STORAGE_KEYS = {
  TASKS: 'flowdesk_tasks_v1',
  MEETINGS: 'flowdesk_meetings_v1',
  PROJECTS: 'flowdesk_projects_v1',
  FOCUS_SESSIONS: 'flowdesk_focus_sessions_v1',
  DAILY_REVIEWS: 'flowdesk_daily_reviews_v1',
  NOTES: 'flowdesk_notes_v1',
  NOTIFICATIONS: 'flowdesk_notifications_v1',
  TIMELINE: 'flowdesk_timeline_v1',
  USER_PROFILE: 'flowdesk_user_profile_v1',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-codelytix',
    name: 'Codelytix',
    description: 'SEO clients, technical audits, and digital infrastructure',
    color: '#3b82f6', // Blue = Work
    category: 'work',
    icon: '📈',
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'proj-beyondbooks',
    name: 'Beyond Books',
    description: 'Website development, modern interactive catalog, brand redesign',
    color: '#a855f7', // Purple = Creative
    category: 'creative',
    icon: '🌐',
    createdAt: '2026-09-05T00:00:00Z',
  },
  {
    id: 'proj-teaching',
    name: 'Teaching',
    description: 'Google Ads Masterclass, PPC lectures, and student cohort mentoring',
    color: '#eab308', // Yellow = Meeting/Teaching
    category: 'teaching',
    icon: '🎓',
    createdAt: '2026-09-10T00:00:00Z',
  },
  {
    id: 'proj-clientwork',
    name: 'Client Work',
    description: 'B2B proposals, ongoing consulting, and enterprise follow-ups',
    color: '#f97316', // Orange = Important
    category: 'business',
    icon: '🏢',
    createdAt: '2026-09-12T00:00:00Z',
  },
  {
    id: 'proj-ailearning',
    name: 'AI Learning',
    description: 'Autonomous agents, custom prompt engineering, and LLM automation',
    color: '#ec4899', // Pink = Personal/AI
    category: 'personal',
    icon: '🤖',
    createdAt: '2026-09-15T00:00:00Z',
  },
  {
    id: 'proj-socialmedia',
    name: 'Social Media',
    description: 'Content calendar, LinkedIn growth, video snippets',
    color: '#10b981', // Green
    category: 'creative',
    icon: '📱',
    createdAt: '2026-09-20T00:00:00Z',
  },
];

export function getInitialTasks(): Task[] {
  const today = getTodayDateString();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return [
    {
      id: 'task-1',
      title: 'Finish Google Ads Training PPT',
      description: 'Prepare slide deck covering Performance Max campaigns and audience targeting for the 4:00 PM workshop',
      status: 'todo',
      priority: 'urgent', // 🔴 Urgent
      projectId: 'proj-teaching',
      tags: ['Slides', 'Google Ads', 'Workshop'],
      dueDate: today,
      dueTime: '15:30',
      estimatedDuration: 60,
      createdAt: '2026-10-04T08:00:00Z',
      order: 1,
    },
    {
      id: 'task-2',
      title: 'Complete Codelytix SEO Audit',
      description: 'Run Screaming Frog crawl, Core Web Vitals assessment, and compile executive PDF report',
      status: 'todo',
      priority: 'high', // 🟠 High
      projectId: 'proj-codelytix',
      tags: ['SEO', 'Technical', 'Client'],
      dueDate: today,
      dueTime: '11:00',
      estimatedDuration: 90,
      createdAt: '2026-10-04T08:15:00Z',
      order: 2,
    },
    {
      id: 'task-3',
      title: 'Update Beyond Books landing page',
      description: 'Deploy new hero section with interactive book preview and mobile responsive fixes',
      status: 'todo',
      priority: 'high', // 🟠 High
      projectId: 'proj-beyondbooks',
      tags: ['Dev', 'UI/UX', 'Frontend'],
      dueDate: today,
      dueTime: '17:00',
      estimatedDuration: 75,
      createdAt: '2026-10-04T08:30:00Z',
      order: 3,
    },
    {
      id: 'task-4',
      title: 'Create social media content',
      description: 'Write 3 carousel posts on digital marketing strategies and schedule via Buffer',
      status: 'todo',
      priority: 'medium', // 🟡 Medium
      projectId: 'proj-socialmedia',
      tags: ['Growth', 'Copywriting'],
      dueDate: today,
      dueTime: '12:30',
      estimatedDuration: 45,
      createdAt: '2026-10-04T08:45:00Z',
      order: 4,
    },
    {
      id: 'task-5',
      title: 'Send client proposal',
      description: 'Review SLA terms and email finalized quarterly retainer proposal to Acme Corp',
      status: 'todo',
      priority: 'low', // 🟢 Low
      projectId: 'proj-clientwork',
      tags: ['Sales', 'Contracts'],
      dueDate: today,
      dueTime: '18:00',
      estimatedDuration: 30,
      createdAt: '2026-10-04T09:00:00Z',
      order: 5,
    },
    {
      id: 'task-6',
      title: "Review tomorrow's meetings",
      description: 'Check calendar links and review pre-reads for client check-ins',
      status: 'todo',
      priority: 'medium',
      projectId: 'proj-clientwork',
      tags: ['Prep', 'Calendar'],
      dueDate: today,
      dueTime: '19:00',
      estimatedDuration: 20,
      createdAt: '2026-10-04T09:15:00Z',
      order: 6,
    },
    // Completed tasks for today (to achieve 3 / 7 completed = 43%)
    {
      id: 'task-7',
      title: 'Set up GA4 event tracking for Codelytix',
      description: 'Configured custom conversion triggers in Google Tag Manager',
      status: 'completed',
      priority: 'high',
      projectId: 'proj-codelytix',
      tags: ['Analytics', 'Setup'],
      dueDate: today,
      dueTime: '09:30',
      estimatedDuration: 40,
      createdAt: '2026-10-04T07:30:00Z',
      completedAt: '2026-10-04T09:45:00Z',
      order: 7,
    },
    {
      id: 'task-8',
      title: 'Draft client onboarding checklist',
      description: 'Created standardized Notion template for incoming SEO accounts',
      status: 'completed',
      priority: 'medium',
      projectId: 'proj-clientwork',
      tags: ['Docs', 'Operations'],
      dueDate: today,
      dueTime: '10:00',
      estimatedDuration: 30,
      createdAt: '2026-10-04T07:45:00Z',
      completedAt: '2026-10-04T10:15:00Z',
      order: 8,
    },
    {
      id: 'task-9',
      title: 'Review weekly KPI dashboard',
      description: 'Checked pipeline revenue and project milestones across teams',
      status: 'completed',
      priority: 'low',
      projectId: 'proj-clientwork',
      tags: ['Metrics', 'Review'],
      dueDate: today,
      dueTime: '10:30',
      estimatedDuration: 25,
      createdAt: '2026-10-04T08:00:00Z',
      completedAt: '2026-10-04T10:45:00Z',
      order: 9,
    },
    // Upcoming task
    {
      id: 'task-10',
      title: 'Build automated AI lead enrichment agent',
      description: 'Integrate OpenAI function calling with Google Sheets webhook for CRM',
      status: 'todo',
      priority: 'high',
      projectId: 'proj-ailearning',
      tags: ['Python', 'AI', 'Agents'],
      dueDate: tomorrow,
      dueTime: '14:00',
      estimatedDuration: 120,
      createdAt: '2026-10-03T14:00:00Z',
      order: 10,
    },
    // Overdue task
    {
      id: 'task-11',
      title: 'Submit tax compliance invoice forms',
      description: 'Upload digital receipts for Q3 hosting expenses',
      status: 'todo',
      priority: 'medium',
      projectId: 'proj-clientwork',
      tags: ['Finance', 'Admin'],
      dueDate: yesterday,
      dueTime: '17:00',
      estimatedDuration: 20,
      createdAt: '2026-10-02T10:00:00Z',
      order: 11,
    },
  ];
}

export function getInitialMeetings(): Meeting[] {
  const today = getTodayDateString();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return [
    {
      id: 'meet-1',
      title: 'Client Meeting',
      date: today,
      startTime: '10:00',
      endTime: '10:45',
      duration: 45,
      client: 'Royal Hardwares',
      meetingType: 'virtual',
      location: 'Google Meet',
      meetingLink: 'https://meet.google.com/rh-client-sync',
      notes: 'Review month-1 SEO performance and new e-commerce product taxonomy strategy.',
      color: '#eab308',
    },
    {
      id: 'meet-2',
      title: 'Team Discussion',
      date: today,
      startTime: '12:30',
      endTime: '13:00',
      duration: 30,
      client: 'Internal Core',
      meetingType: 'virtual',
      location: 'Zoom',
      meetingLink: 'https://zoom.us/j/team-sync-hari',
      notes: 'Weekly sprint alignment and Beyond Books staging deployment readiness.',
      color: '#a855f7',
    },
    {
      id: 'meet-3',
      title: 'Google Ads Class',
      date: today,
      startTime: '16:00',
      endTime: '17:00',
      duration: 60,
      client: 'Digital Academy',
      meetingType: 'class',
      location: 'Google Meet Live Classroom',
      meetingLink: 'https://meet.google.com/ads-academy-live',
      notes: 'Live lecture on search ad extensions, smart bidding algorithms, and negative keywords.',
      color: '#eab308',
    },
    {
      id: 'meet-4',
      title: 'Product Roadmap Sync',
      date: tomorrow,
      startTime: '11:00',
      endTime: '11:45',
      duration: 45,
      client: 'Beyond Books Team',
      meetingType: 'virtual',
      location: 'Google Meet',
      meetingLink: 'https://meet.google.com/bb-roadmap',
      notes: 'Finalize phase 2 requirements for author storefronts.',
      color: '#3b82f6',
    },
  ];
}

export const INITIAL_TIMELINE: TimelineBlock[] = [
  { id: 't-1', time: '09:00', endTime: '10:00', title: 'SEO Client Work', type: 'task', colorType: 'green', detail: 'Technical crawl audit & site speed fixes', completed: true },
  { id: 't-2', time: '10:00', endTime: '10:45', title: 'Client Meeting: Royal Hardwares', type: 'meeting', colorType: 'yellow', detail: 'Google Meet (45 min)', completed: true },
  { id: 't-3', time: '11:30', endTime: '12:30', title: 'Content Creation & Copy', type: 'task', colorType: 'purple', detail: 'Social media carousels & blogs' },
  { id: 't-4', time: '12:30', endTime: '13:00', title: 'Team Discussion Sync', type: 'meeting', colorType: 'yellow', detail: 'Sprint roadmap' },
  { id: 't-5', time: '13:00', endTime: '14:00', title: 'Healthy Lunch & Break', type: 'break', colorType: 'pink', detail: 'Step away from screen' },
  { id: 't-6', time: '14:00', endTime: '15:30', title: 'Website Development (Beyond Books)', type: 'task', colorType: 'blue', detail: 'Frontend hero interactive revamp' },
  { id: 't-7', time: '16:00', endTime: '17:00', title: 'Google Ads Class (Live Lecture)', type: 'meeting', colorType: 'yellow', detail: 'Teaching session with 35 students' },
  { id: 't-8', time: '17:30', endTime: '18:30', title: 'Client Follow-ups & Proposal', type: 'task', colorType: 'orange', detail: 'Acme Corp contract and client notes' },
];

export const INITIAL_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: 'f-1',
    taskId: 'task-7',
    taskTitle: 'Set up GA4 event tracking for Codelytix',
    startTime: '2026-10-04T08:50:00Z',
    endTime: '2026-10-04T09:30:00Z',
    durationMinutes: 40,
    completed: true,
    notes: 'Configured all tags and tested preview mode successfully.',
  },
  {
    id: 'f-2',
    taskId: 'task-8',
    taskTitle: 'Draft client onboarding checklist',
    startTime: '2026-10-04T09:40:00Z',
    endTime: '2026-10-04T10:10:00Z',
    durationMinutes: 30,
    completed: true,
  },
  {
    id: 'f-3',
    taskId: 'task-1',
    taskTitle: 'Finish Google Ads Training PPT',
    startTime: '2026-10-03T15:00:00Z',
    endTime: '2026-10-03T15:45:00Z',
    durationMinutes: 45,
    completed: false,
    notes: 'Outlined sections 1 through 4.',
  },
];

export const INITIAL_NOTES: NoteIdea[] = [
  {
    id: 'n-1',
    title: 'FlowDesk Micro-interaction Philosophy',
    content: 'Keep colors intentional: Red for true emergencies, Green for completion dopamine, Yellow for calendar friction. Whitespace is the greatest productivity asset.',
    type: 'idea',
    tags: ['Design', 'Philosophy'],
    color: '#8b5cf6',
    createdAt: '2026-10-04T07:00:00Z',
    updatedAt: '2026-10-04T07:00:00Z',
  },
  {
    id: 'n-2',
    title: 'Royal Hardwares Strategy Notes',
    content: 'Client wants 25% organic uplift in local Chennai queries. Focus on localized schema markups, Google Business Profile post schedule, and category page internal linking.',
    type: 'note',
    tags: ['Royal Hardwares', 'Client'],
    color: '#3b82f6',
    createdAt: '2026-10-03T18:00:00Z',
    updatedAt: '2026-10-03T18:00:00Z',
  },
  {
    id: 'n-3',
    title: 'Google Ads Student Q&A Topics',
    content: 'Common questions: How to optimize budget split between Brand Search vs. PMax? Negative keyword lists hierarchy at MCC level.',
    type: 'snippet',
    tags: ['Teaching', 'Questions'],
    color: '#eab308',
    createdAt: '2026-10-02T16:00:00Z',
    updatedAt: '2026-10-02T16:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Upcoming Meeting in 30 mins',
    message: 'Client Meeting with Royal Hardwares starts at 10:00 AM on Google Meet.',
    time: '09:30 AM',
    type: 'meeting',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Priority Deadline Approaching',
    message: 'Finish Google Ads Training PPT is scheduled for 15:30 today.',
    time: '08:45 AM',
    type: 'warning',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Productivity Streak 🚀',
    message: 'You have logged 4 consecutive days with over 80% task completion!',
    time: 'Yesterday',
    type: 'success',
    read: true,
  },
];

export const DEFAULT_USER = {
  name: 'Hari',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  title: 'Founder & Growth Strategist',
  soundEnabled: true,
  workingHoursStart: '09:00',
  workingHoursEnd: '18:30',
  focusDuration: 25, // default Pomodoro minutes
};

// Storage helper functions
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export { STORAGE_KEYS };
