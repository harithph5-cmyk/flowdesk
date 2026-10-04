import { Priority, Task, Meeting, Project, DailyPlanSchedule } from '../types';
import { getTodayDateString } from './date';

export interface ParsedItem {
  type: 'task' | 'meeting' | 'advice';
  taskData?: Partial<Task>;
  meetingData?: Partial<Meeting>;
  adviceText?: string;
  confidence: number;
}

export function parseNaturalLanguageInput(
  input: string,
  projects: Project[]
): ParsedItem {
  const text = input.trim();
  const lower = text.toLowerCase();
  const today = getTodayDateString();

  // Calculate tomorrow's date string
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  // 1. Check if user is asking for prioritization / advice
  if (
    lower.includes('what should i do first') ||
    lower.includes('too many tasks') ||
    lower.includes('help me prioritize') ||
    lower.includes('what to focus on') ||
    lower.includes('overwhelmed')
  ) {
    return {
      type: 'advice',
      adviceText: `Here is your optimal focus strategy:\n\n1. 🎯 **Deep Work First (09:00 - 11:30):** Tackle your highest cognitive task before meetings disrupt your flow.\n2. 📅 **Protect Calendar Commitments:** Attend meetings with prepared action items.\n3. ⚡ **Quick Wins & Follow-ups (Afternoon):** Clear pending proposals and emails when energy naturally dips.\n\nClick **"✨ Plan My Day"** in the top bar to auto-schedule your day!`,
      confidence: 0.95,
    };
  }

  // 2. Check if it's a meeting
  const isMeeting =
    lower.startsWith('meeting') ||
    lower.includes('meet with') ||
    lower.includes('call with') ||
    lower.includes('discussion with') ||
    lower.includes('class with') ||
    lower.includes('sync with');

  if (isMeeting) {
    let title = text.replace(/^(schedule\s+|add\s+|create\s+)?(a\s+)?/i, '');
    let date = today;
    if (lower.includes('tomorrow')) {
      date = tomorrow;
      title = title.replace(/\btomorrow\b/gi, '').trim();
    }

    // Time detection: e.g. "at 3 pm", "at 10:30 am", "3pm", "15:00"
    let startTime = '10:00';
    const timeMatch = title.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2] ? timeMatch[2] : '00';
      const meridiem = timeMatch[3]?.toLowerCase();

      if (meridiem === 'pm' && hours < 12) hours += 12;
      if (meridiem === 'am' && hours === 12) hours = 0;
      
      startTime = `${String(hours).padStart(2, '0')}:${minutes}`;
      title = title.replace(/\bat\s+\d{1,2}(?::\d{2})?\s*(am|pm)?/gi, '').replace(/\b\d{1,2}(?::\d{2})?\s*(am|pm)\b/gi, '').trim();
    }

    // End time calculation (default 45 min)
    const [startH, startM] = startTime.split(':').map(Number);
    const endMinutesTotal = startH * 60 + startM + 45;
    const endH = Math.floor(endMinutesTotal / 60) % 24;
    const endM = endMinutesTotal % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    // Detect client
    let client = '';
    const clientMatch = title.match(/(?:with|for)\s+([A-Za-z0-9\s&]+?)(?:\s+at|\s+on|$)/i);
    if (clientMatch) {
      client = clientMatch[1].trim();
    }

    // Clean title
    title = title.replace(/^(meeting\s+with\s+|meet\s+with\s+)/i, 'Meeting with ');
    if (!title.toLowerCase().startsWith('meeting')) {
      title = `Meeting: ${title}`;
    }

    return {
      type: 'meeting',
      meetingData: {
        title: title || 'New Meeting',
        date,
        startTime,
        endTime,
        duration: 45,
        client: client || undefined,
        meetingType: 'virtual',
        meetingLink: 'https://meet.google.com/new',
      },
      confidence: 0.9,
    };
  }

  // 3. Otherwise treat as Task
  let taskTitle = text.replace(/^(tomorrow\s+i\s+need\s+to\s+|i\s+need\s+to\s+|todo:\s*|please\s+|task:\s*)/i, '').trim();
  let dueDate = today;
  if (lower.includes('tomorrow')) {
    dueDate = tomorrow;
    taskTitle = taskTitle.replace(/\btomorrow\b/gi, '').trim();
  }

  // Detect time if specified (e.g., "at 4pm", "by 5:00 pm")
  let dueTime: string | undefined;
  const timeMatch = taskTitle.match(/(?:at|by)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2] ? timeMatch[2] : '00';
    const meridiem = timeMatch[3]?.toLowerCase();
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
    dueTime = `${String(hours).padStart(2, '0')}:${minutes}`;
    taskTitle = taskTitle.replace(/(?:at|by)\s+\d{1,2}(?::\d{2})?\s*(am|pm)?/gi, '').trim();
  }

  // Priority detection
  let priority: Priority = 'medium';
  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('critical') || lower.includes('🔥')) {
    priority = 'urgent';
    taskTitle = taskTitle.replace(/\b(urgent|asap|critical)\b/gi, '').trim();
  } else if (lower.includes('high') || lower.includes('important') || lower.includes('must do')) {
    priority = 'high';
    taskTitle = taskTitle.replace(/\b(high priority|important|must do)\b/gi, '').trim();
  } else if (lower.includes('low') || lower.includes('someday') || lower.includes('minor')) {
    priority = 'low';
    taskTitle = taskTitle.replace(/\b(low priority|someday|minor)\b/gi, '').trim();
  }

  // Match project based on name keywords
  let projectId = projects[0]?.id || 'p-work';
  for (const proj of projects) {
    if (lower.includes(proj.name.toLowerCase())) {
      projectId = proj.id;
      break;
    }
  }

  // Clean title capitalization
  if (taskTitle.length > 0) {
    taskTitle = taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1);
  } else {
    taskTitle = 'Untitled Task';
  }

  return {
    type: 'task',
    taskData: {
      title: taskTitle,
      dueDate,
      dueTime,
      priority,
      projectId,
      status: 'todo',
      tags: [priority],
      estimatedDuration: 45,
    },
    confidence: 0.88,
  };
}

// Generate an intelligent time-blocked schedule for Hari
export function generateSmartDailyPlan(
  tasks: Task[],
  meetings: Meeting[],
  projects: Project[]
): DailyPlanSchedule {
  const today = getTodayDateString();
  const todayTasks = tasks.filter((t) => t.status !== 'completed' && t.dueDate <= today);
  const todayMeetings = meetings.filter((m) => m.date === today);

  // Sort tasks by priority urgency
  const priorityWeight: Record<Priority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const sortedTasks = [...todayTasks].sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

  // Construct schedule blocks
  const blocks: DailyPlanSchedule['blocks'] = [];

  // Start at 09:00
  let currentHour = 9;
  let currentMinute = 0;

  const formatBlockTime = (h: number, m: number) =>
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

  // Process morning deep work
  const topTask = sortedTasks[0];
  if (topTask) {
    const proj = projects.find((p) => p.id === topTask.projectId);
    blocks.push({
      startTime: formatBlockTime(currentHour, currentMinute),
      endTime: '10:30',
      title: `🔥 Deep Focus: ${topTask.title}`,
      type: 'task',
      priority: topTask.priority,
      colorType: topTask.priority === 'urgent' ? 'red' : 'orange',
      reason: `High cognitive task under ${proj?.name || 'Primary'} to tackle before context switching.`,
    });
    currentHour = 10;
    currentMinute = 30;
  }

  // Add meetings or mid-day work
  const morningMeeting = todayMeetings.find((m) => m.startTime >= '10:00' && m.startTime < '12:00');
  if (morningMeeting) {
    blocks.push({
      startTime: morningMeeting.startTime,
      endTime: morningMeeting.endTime,
      title: `📅 ${morningMeeting.title}${morningMeeting.client ? ` (${morningMeeting.client})` : ''}`,
      type: 'meeting',
      colorType: 'yellow',
      reason: 'Scheduled client interaction with action items.',
    });
  } else {
    // 2nd task
    const secondTask = sortedTasks[1];
    if (secondTask) {
      blocks.push({
        startTime: '10:30',
        endTime: '11:45',
        title: `🔵 Work Block: ${secondTask.title}`,
        type: 'task',
        priority: secondTask.priority,
        colorType: 'blue',
        reason: 'Maintain momentum on core deliverables.',
      });
    }
  }

  // Lunch break
  blocks.push({
    startTime: '12:30',
    endTime: '01:30',
    title: '🍴 Healthy Lunch & Recharge Walk',
    type: 'break',
    colorType: 'pink',
    reason: 'Crucial cognitive reset to prevent afternoon fatigue.',
  });

  // Afternoon work session
  const afternoonTask = sortedTasks[2] || sortedTasks[1];
  if (afternoonTask) {
    blocks.push({
      startTime: '02:00',
      endTime: '03:30',
      title: `🟣 Creative/Execution: ${afternoonTask.title}`,
      type: 'task',
      priority: afternoonTask.priority,
      colorType: 'purple',
      reason: 'Focused sprint on training, creative output, or deck review.',
    });
  }

  // Afternoon meeting
  const afternoonMeeting = todayMeetings.find((m) => m.startTime >= '14:00');
  if (afternoonMeeting) {
    blocks.push({
      startTime: afternoonMeeting.startTime,
      endTime: afternoonMeeting.endTime,
      title: `📅 ${afternoonMeeting.title}`,
      type: 'meeting',
      colorType: 'yellow',
      reason: 'Scheduled collaboration & teaching session.',
    });
  }

  // Wrap up & Follow ups
  const remainingTask = sortedTasks[3] || sortedTasks[0];
  blocks.push({
    startTime: '05:00',
    endTime: '06:00',
    title: remainingTask ? `🟠 Follow-ups & Closure: ${remainingTask.title}` : '🟠 Daily Follow-ups & Email Inbox Zero',
    type: 'task',
    priority: 'low',
    colorType: 'orange',
    reason: 'Tidy loose ends and finalize communications.',
  });

  // Daily Review wrap-up
  blocks.push({
    startTime: '06:00',
    endTime: '06:15',
    title: '✨ FlowDesk Daily Review',
    type: 'task',
    colorType: 'green',
    reason: 'Log achievements and transition out of work mode.',
  });

  return {
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    summary: `Structured around ${todayTasks.length} active tasks and ${todayMeetings.length} meetings with balanced 90-minute focus blocks and dedicated breaks.`,
    blocks,
  };
}
