import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MeetingCard } from './MeetingCard';
import { getTodayDateString, formatFullDate, formatTime12 } from '../../utils/date';
import { Meeting } from '../../types';

export type CalendarTab = 'today' | 'week' | 'month';

export const CalendarView: React.FC = () => {
  const {
    meetings,
    setIsMeetingModalOpen,
    setSelectedMeetingForEdit,
  } = useApp();

  const [calView, setCalView] = useState<CalendarTab>('today');
  const todayStr = getTodayDateString();

  const todayMeetings = meetings.filter((m) => m.date === todayStr);

  const handleCreateMeeting = () => {
    setSelectedMeetingForEdit(null);
    setIsMeetingModalOpen(true);
  };

  const handleEdit = (m: Meeting) => {
    setSelectedMeetingForEdit(m);
    setIsMeetingModalOpen(true);
  };

  // Generate 7 days for Week View
  const getWeekDays = () => {
    const days = [];
    const base = new Date();
    // Monday of current week
    const day = base.getDay();
    const diff = base.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(base.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      days.push({
        dateStr: dStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: dStr === todayStr,
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-amber-500" />
            <span>Meetings & Calendar</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Synchronized with your daily workflow and client commitments
          </p>
        </div>

        {/* View Switcher & Add Meeting */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setCalView('today')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                calView === 'today'
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setCalView('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                calView === 'week'
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setCalView('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                calView === 'month'
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month
            </button>
          </div>

          <button
            onClick={handleCreateMeeting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-amber-200"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Meeting</span>
          </button>
        </div>
      </div>

      {/* TODAY VIEW */}
      {calView === 'today' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                📅 TODAY'S SCHEDULE
              </span>
              <span className="text-xs text-slate-400">
                {todayMeetings.length} meeting{todayMeetings.length !== 1 ? 's' : ''} scheduled
              </span>
            </div>
          </div>

          {todayMeetings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center space-y-2">
              <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No meetings scheduled for today</p>
              <p className="text-xs text-slate-400">Enjoy deep work uninterrupted focus time!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayMeetings
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((m) => (
                  <MeetingCard key={m.id} meeting={m} onEdit={handleEdit} />
                ))}
            </div>
          )}
        </div>
      )}

      {/* WEEK VIEW */}
      {calView === 'week' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map((day) => {
              const dayMeetings = meetings.filter((m) => m.date === day.dateStr);
              return (
                <div
                  key={day.dateStr}
                  className={`rounded-2xl p-3 border min-h-[220px] flex flex-col justify-between ${
                    day.isToday
                      ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-400/20'
                      : 'bg-white border-slate-200/80'
                  }`}
                >
                  <div className="border-b border-slate-100 pb-2 mb-2 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-slate-400 block">
                        {day.dayName}
                      </span>
                      <span
                        className={`text-sm font-extrabold ${
                          day.isToday ? 'text-amber-600' : 'text-slate-800'
                        }`}
                      >
                        {day.dayNum}
                      </span>
                    </div>
                    {day.isToday && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5 overflow-y-auto">
                    {dayMeetings.length === 0 ? (
                      <p className="text-[11px] text-slate-300 pt-3 text-center">No calls</p>
                    ) : (
                      dayMeetings.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => handleEdit(m)}
                          className="p-1.5 rounded-lg bg-amber-100/70 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs cursor-pointer transition-colors"
                        >
                          <p className="font-bold truncate text-[11px]">{m.title}</p>
                          <p className="text-[10px] text-amber-700">{formatTime12(m.startTime)}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMeetingForEdit(null);
                      setIsMeetingModalOpen(true);
                    }}
                    className="mt-2 w-full py-1 text-[10px] font-semibold text-slate-400 hover:text-amber-600 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200 text-center"
                  >
                    + Add
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MONTH VIEW */}
      {calView === 'month' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">October 2026</h3>
            <span className="text-xs text-slate-400">{meetings.length} Total Events in schedule</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-2 border-b border-slate-100">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-10-${String(dayNum).padStart(2, '0')}`;
              const dayMeetings = meetings.filter((m) => m.date === dateStr);
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    if (dayMeetings.length > 0) handleEdit(dayMeetings[0]);
                  }}
                  className={`min-h-[64px] p-1.5 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                    isToday
                      ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20'
                      : dayMeetings.length > 0
                      ? 'bg-slate-50/70 hover:bg-white border-amber-200'
                      : 'hover:bg-slate-50 border-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday ? 'text-amber-600' : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayMeetings.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </div>

                  {dayMeetings.length > 0 && (
                    <div className="truncate text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-1 py-0.5 rounded">
                      {dayMeetings[0].title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
