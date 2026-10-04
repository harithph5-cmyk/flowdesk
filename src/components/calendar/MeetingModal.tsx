import React, { useState, useEffect } from 'react';
import { X, Calendar as CalIcon, Clock, Video, Building, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Meeting } from '../../types';
import { getTodayDateString } from '../../utils/date';

export const MeetingModal: React.FC = () => {
  const {
    isMeetingModalOpen,
    setIsMeetingModalOpen,
    selectedMeetingForEdit,
    setSelectedMeetingForEdit,
    addMeeting,
    updateMeeting,
  } = useApp();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:45');
  const [duration, setDuration] = useState(45);
  const [client, setClient] = useState('');
  const [meetingType, setMeetingType] = useState<Meeting['meetingType']>('virtual');
  const [location, setLocation] = useState('Google Meet');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/new');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedMeetingForEdit) {
      setTitle(selectedMeetingForEdit.title);
      setDate(selectedMeetingForEdit.date);
      setStartTime(selectedMeetingForEdit.startTime);
      setEndTime(selectedMeetingForEdit.endTime);
      setDuration(selectedMeetingForEdit.duration);
      setClient(selectedMeetingForEdit.client || '');
      setMeetingType(selectedMeetingForEdit.meetingType);
      setLocation(selectedMeetingForEdit.location || '');
      setMeetingLink(selectedMeetingForEdit.meetingLink || '');
      setNotes(selectedMeetingForEdit.notes || '');
    } else {
      setTitle('');
      setDate(getTodayDateString());
      setStartTime('10:00');
      setEndTime('10:45');
      setDuration(45);
      setClient('');
      setMeetingType('virtual');
      setLocation('Google Meet');
      setMeetingLink('https://meet.google.com/new');
      setNotes('');
    }
  }, [selectedMeetingForEdit, isMeetingModalOpen]);

  if (!isMeetingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (selectedMeetingForEdit) {
      updateMeeting(selectedMeetingForEdit.id, {
        title: title.trim(),
        date,
        startTime,
        endTime,
        duration,
        client: client.trim() || undefined,
        meetingType,
        location: location.trim() || undefined,
        meetingLink: meetingLink.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addMeeting({
        title: title.trim(),
        date,
        startTime,
        endTime,
        duration,
        client: client.trim() || undefined,
        meetingType,
        location: location.trim() || undefined,
        meetingLink: meetingLink.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }

    setIsMeetingModalOpen(false);
    setSelectedMeetingForEdit(null);
  };

  const handleClose = () => {
    setIsMeetingModalOpen(false);
    setSelectedMeetingForEdit(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {selectedMeetingForEdit ? 'Edit Meeting' : 'Schedule New Meeting'}
          </h3>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Meeting Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Client Meeting: Royal Hardwares"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-sm font-semibold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Client / Company
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Royal Hardwares"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Meeting Type
              </label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value as Meeting['meetingType'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none bg-white"
              >
                <option value="virtual">Virtual (Meet/Zoom)</option>
                <option value="in-person">In-Person</option>
                <option value="class">Class / Workshop</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min={10}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Meeting Link (URL)
              </label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Agenda & Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key discussion points, slides link, or action items..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-sm"
            >
              {selectedMeetingForEdit ? 'Save Meeting' : 'Add to Calendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
