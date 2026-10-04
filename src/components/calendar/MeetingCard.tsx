import React from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
  Download,
  Building,
} from 'lucide-react';
import { Meeting } from '../../types';
import { formatTime12, generateGoogleCalendarUrl, exportMeetingToIcs } from '../../utils/date';
import { useApp } from '../../context/AppContext';

interface MeetingCardProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onEdit }) => {
  const { deleteMeeting } = useApp();

  const googleCalUrl = generateGoogleCalendarUrl(meeting);

  const getDurationLabel = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h} hour${h > 1 ? 's' : ''}`;
  };

  return (
    <div className="group relative rounded-2xl p-4 bg-gradient-to-br from-amber-50/40 via-white to-purple-50/40 border border-amber-200/80 shadow-xs hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left: Time badge & Info */}
        <div className="flex items-start gap-3.5">
          <div className="bg-amber-100/90 text-amber-900 border border-amber-300/60 rounded-xl p-2.5 text-center min-w-[72px] shrink-0 shadow-xs">
            <span className="block text-xs font-extrabold uppercase tracking-tight">
              {formatTime12(meeting.startTime)}
            </span>
            <span className="block text-[11px] font-semibold text-amber-700/90 mt-0.5">
              {getDurationLabel(meeting.duration)}
            </span>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                {meeting.title}
              </h4>

              {meeting.meetingType && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-purple-100 text-purple-700 border border-purple-200">
                  {meeting.meetingType}
                </span>
              )}
            </div>

            {meeting.client && (
              <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-600" />
                <span>{meeting.client}</span>
              </p>
            )}

            {meeting.location && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{meeting.location}</span>
              </p>
            )}

            {meeting.notes && (
              <p className="text-xs text-slate-600 pt-1 leading-relaxed line-clamp-2">
                {meeting.notes}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions, Video Link & Google Cal */}
        <div className="flex flex-wrap sm:flex-col items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-1.5">
            {meeting.meetingLink && (
              <a
                href={meeting.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                title="Join Video Call"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join</span>
              </a>
            )}

            <a
              href={googleCalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
              title="Add to Google Calendar"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xs:inline">Google Cal</span>
            </a>

            <button
              onClick={() => exportMeetingToIcs(meeting)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Download .ICS file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(meeting)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit Meeting"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => deleteMeeting(meeting.id)}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Meeting"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
