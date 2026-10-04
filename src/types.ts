export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export type ProjectCategory = 'work' | 'creative' | 'personal' | 'academic' | 'business' | 'teaching';

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string; // hex or tailwind identifier
  category: ProjectCategory;
  icon?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  projectId: string;
  tags: string[];
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  estimatedDuration: number; // in minutes
  createdAt: string;
  completedAt?: string;
  order: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // in minutes
  client?: string;
  meetingType: 'virtual' | 'in-person' | 'hybrid' | 'class';
  location?: string;
  meetingLink?: string;
  notes?: string;
  color?: string;
}

export interface FocusSession {
  id: string;
  taskId: string;
  taskTitle: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  completed: boolean;
  notes?: string;
}

export interface DailyReview {
  id: string;
  date: string; // YYYY-MM-DD
  completedTaskIds: string[];
  remainingTaskIds: string[];
  movedToTomorrowIds: string[];
  biggestAchievement: string;
  gratitudeOrLearnings?: string;
  energyRating: number; // 1-5
  savedAt: string;
}

export interface NoteIdea {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'idea' | 'snippet';
  tags: string[];
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineBlock {
  id: string;
  time: string; // "09:00"
  endTime?: string;
  title: string;
  type: 'task' | 'meeting' | 'break' | 'focus';
  colorType: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'grey';
  detail?: string;
  relatedId?: string;
  completed?: boolean;
}

export interface DailyPlanSchedule {
  generatedAt: string;
  summary: string;
  blocks: {
    startTime: string;
    endTime: string;
    title: string;
    type: 'task' | 'meeting' | 'break';
    priority?: Priority;
    colorType: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'grey';
    reason: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'warning' | 'info' | 'success' | 'meeting';
  read: boolean;
}
