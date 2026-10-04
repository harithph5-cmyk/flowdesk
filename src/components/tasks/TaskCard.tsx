import React, { useState } from 'react';
import {
  Check,
  Clock,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Flame,
  Tag as TagIcon,
  Play,
  GripVertical,
} from 'lucide-react';
import { Task, Priority } from '../../types';
import { useApp } from '../../context/AppContext';
import { getRelativeDueDateInfo } from '../../utils/date';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const { toggleTaskStatus, deleteTask, projects, startFocusOnTask } = useApp();
  const [showNotes, setShowNotes] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isCompleted = task.status === 'completed';
  const project = projects.find((p) => p.id === task.projectId);
  const dueInfo = getRelativeDueDateInfo(task.dueDate, task.dueTime);

  // Priority Visual Treatment
  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return {
          pill: 'bg-rose-50 text-rose-700 border-rose-200/90 font-bold',
          dot: 'bg-rose-500',
          cardBorder: !isCompleted ? 'border-rose-200 hover:border-rose-400' : '',
          icon: '🔴',
          label: 'Urgent',
        };
      case 'high':
        return {
          pill: 'bg-orange-50 text-orange-700 border-orange-200/90 font-bold',
          dot: 'bg-orange-500',
          cardBorder: !isCompleted ? 'border-orange-200 hover:border-orange-400' : '',
          icon: '🟠',
          label: 'High',
        };
      case 'medium':
        return {
          pill: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
          dot: 'bg-amber-500',
          cardBorder: !isCompleted ? 'border-slate-200 hover:border-amber-300' : '',
          icon: '🟡',
          label: 'Medium',
        };
      case 'low':
        return {
          pill: 'bg-slate-50 text-slate-600 border-slate-200 font-medium',
          dot: 'bg-slate-400',
          cardBorder: !isCompleted ? 'border-slate-200 hover:border-slate-300' : '',
          icon: '🟢',
          label: 'Low',
        };
    }
  };

  const priorityStyle = getPriorityStyle(task.priority);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    setTimeout(() => {
      deleteTask(task.id);
    }, 200);
  };

  return (
    <div
      draggable={!isCompleted}
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      onDragOver={(e) => onDragOver && onDragOver(e)}
      onDrop={(e) => onDrop && onDrop(e, task.id)}
      className={`group relative rounded-2xl p-4 transition-all duration-200 border ${
        isDeleting ? 'opacity-0 scale-95' : 'opacity-100'
      } ${
        isCompleted
          ? 'bg-slate-50/70 border-slate-200/60 text-slate-400 shadow-none'
          : `bg-white shadow-xs hover:shadow-md ${priorityStyle.cardBorder}`
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        {!isCompleted && (
          <div className="mt-1 cursor-grab opacity-0 group-hover:opacity-60 hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity">
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        {/* Animated Checkbox */}
        <button
          onClick={() => toggleTaskStatus(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs scale-105'
              : 'border-slate-300 hover:border-emerald-500 bg-white hover:scale-105'
          }`}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3] animate-in zoom-in-50 duration-150" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4
              className={`text-sm sm:text-base font-semibold leading-snug transition-all ${
                isCompleted
                  ? 'line-through text-slate-400 font-normal'
                  : 'text-slate-800 group-hover:text-indigo-950'
              }`}
            >
              {task.title}
            </h4>

            {/* Badges: Priority & Due Date */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {/* Priority badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs border ${priorityStyle.pill}`}
              >
                <span>{priorityStyle.icon}</span>
                <span>{priorityStyle.label}</span>
              </span>

              {/* Due Date badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold border ${dueInfo.badgeColor}`}
              >
                <Clock className="w-3 h-3" />
                <span>{dueInfo.label}</span>
              </span>
            </div>
          </div>

          {/* Project & Tags metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {project && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-medium border border-slate-200/80"
                style={{
                  backgroundColor: `${project.color}15`,
                  color: project.color,
                }}
              >
                <span>{project.icon || '📁'}</span>
                <span>{project.name}</span>
              </span>
            )}

            {task.tags && task.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium"
              >
                <TagIcon className="w-2.5 h-2.5 text-slate-400" />
                <span>{tag}</span>
              </span>
            ))}

            {task.description && (
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 font-medium ml-1"
              >
                <span>{showNotes ? 'Hide notes' : 'View notes'}</span>
                {showNotes ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>

          {/* Collapsible Notes description */}
          {showNotes && task.description && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
              {task.description}
            </div>
          )}
        </div>

        {/* Action buttons (hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {!isCompleted && (
            <button
              onClick={() => startFocusOnTask(task.id)}
              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
              title="Start Focus on this task"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
