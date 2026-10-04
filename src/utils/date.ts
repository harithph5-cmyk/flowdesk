import { Meeting } from '../types';

export function getGreeting(userName = 'Hari'): { greeting: string; icon: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { greeting: `Good morning, ${userName}`, icon: '☀️' };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: `Good afternoon, ${userName}`, icon: '🌤️' };
  } else if (hour >= 17 && hour < 22) {
    return { greeting: `Good evening, ${userName}`, icon: '👋' };
  } else {
    return { greeting: `Working late, ${userName}`, icon: '🌙' };
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatFullDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime12(timeStr?: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // 0 becomes 12
  return `${h}:${m} ${ampm}`;
}

export function getRelativeDueDateInfo(dueDate: string, dueTime?: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  badgeColor: string;
} {
  const todayStr = getTodayDateString();
  const now = new Date();

  if (dueDate < todayStr) {
    return {
      label: 'Overdue',
      isOverdue: true,
      isToday: false,
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    };
  }

  if (dueDate === todayStr) {
    if (dueTime) {
      const [h, m] = dueTime.split(':').map(Number);
      const dueMoment = new Date();
      dueMoment.setHours(h, m, 0, 0);
      if (dueMoment < now) {
        return {
          label: `Past ${formatTime12(dueTime)}`,
          isOverdue: true,
          isToday: true,
          badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
        };
      }
      return {
        label: `Today at ${formatTime12(dueTime)}`,
        isOverdue: false,
        isToday: true,
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      };
    }
    return {
      label: 'Today',
      isOverdue: false,
      isToday: true,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    };
  }

  // Future date
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return {
      label: dueTime ? `Tomorrow at ${formatTime12(dueTime)}` : 'Tomorrow',
      isOverdue: false,
      isToday: false,
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
  }

  return {
    label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    isOverdue: false,
    isToday: false,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
  };
}

export function generateGoogleCalendarUrl(meeting: Meeting): string {
  const dateFormatted = meeting.date.replace(/-/g, '');
  const startT = meeting.startTime.replace(':', '') + '00';
  const endT = meeting.endTime.replace(':', '') + '00';
  const dates = `${dateFormatted}T${startT}/${dateFormatted}T${endT}`;
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: meeting.title,
    dates: dates,
    details: `${meeting.client ? `Client: ${meeting.client}\n` : ''}${meeting.notes || ''}\n${meeting.meetingLink ? `Link: ${meeting.meetingLink}` : ''}`,
    location: meeting.location || meeting.meetingLink || '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function exportMeetingToIcs(meeting: Meeting) {
  const dateFormatted = meeting.date.replace(/-/g, '');
  const startT = meeting.startTime.replace(':', '') + '00';
  const endT = meeting.endTime.replace(':', '') + '00';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FlowDesk//Personal Productivity//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${meeting.title}`,
    `DTSTART:${dateFormatted}T${startT}`,
    `DTEND:${dateFormatted}T${endT}`,
    `DESCRIPTION:${meeting.client ? `Client: ${meeting.client}\\n` : ''}${meeting.notes || ''}`,
    `LOCATION:${meeting.location || meeting.meetingLink || ''}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${meeting.title.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
