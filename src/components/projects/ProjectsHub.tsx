import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  MoreVertical,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectCategory } from '../../types';

export const ProjectsHub: React.FC = () => {
  const {
    projects,
    tasks,
    addProject,
    deleteProject,
    setSelectedProjectId,
    setActiveTab,
  } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [category, setCategory] = useState<ProjectCategory>('work');
  const [icon, setIcon] = useState('💼');

  const colorPalette = [
    { label: 'Work Blue', hex: '#3b82f6' },
    { label: 'Creative Purple', hex: '#a855f7' },
    { label: 'Completed Green', hex: '#10b981' },
    { label: 'Important Orange', hex: '#f97316' },
    { label: 'Urgent Red', hex: '#ef4444' },
    { label: 'Meeting Yellow', hex: '#eab308' },
    { label: 'Personal Pink', hex: '#ec4899' },
    { label: 'Grey Low', hex: '#64748b' },
  ];

  const iconOptions = ['🌐', '📈', '📱', '🎓', '🤖', '🏢', '📚', '💼', '🚀', '🎨'];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name: name.trim(),
      description: description.trim(),
      color,
      category,
      icon,
    });

    setName('');
    setDescription('');
    setIsCreateOpen(false);
  };

  const handleViewTasks = (projId: string) => {
    setSelectedProjectId(projId);
    setActiveTab('tasks');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-indigo-600" />
            <span>Projects Command Hub</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organize clients, platforms, and learning paths with dedicated metrics
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const projTasks = tasks.filter((t) => t.projectId === proj.id);
          const activeTasks = projTasks.filter((t) => t.status !== 'completed');
          const completedTasks = projTasks.filter((t) => t.status === 'completed');
          const totalTasks = projTasks.length;
          const progressPercent = totalTasks > 0
            ? Math.round((completedTasks.length / totalTasks) * 100)
            : 0;

          return (
            <div
              key={proj.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-xs"
                      style={{
                        backgroundColor: `${proj.color}20`,
                        border: `1px solid ${proj.color}40`,
                      }}
                    >
                      {proj.icon || '📁'}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {proj.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {proj.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className="w-3 h-3 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: proj.color }}
                  />
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[32px]">
                  {proj.description || 'Dedicated project initiatives and ongoing work.'}
                </p>

                {/* Progress Bar & Stats */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Completion</span>
                    <span className="font-bold text-slate-800">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: proj.color,
                      }}
                    />
                  </div>
                </div>

                {/* Active vs Completed Badges */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{activeTasks.length} active</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>{completedTasks.length} done</span>
                  </span>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleViewTasks(proj.id)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 group-hover:translate-x-0.5 transition-all"
                >
                  <span>View Tasks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {projects.length > 2 && (
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="text-slate-300 hover:text-rose-500 text-xs px-2 py-1 rounded"
                    title="Delete project"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Create New Project</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Beyond Books, Codelytix, AI Studio"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Goals, target deliverables, or client details..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Icon
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {iconOptions.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                        icon === ic
                          ? 'bg-indigo-50 border-indigo-500 scale-110 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Color Theme
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {colorPalette.map((cp) => (
                    <button
                      key={cp.hex}
                      type="button"
                      onClick={() => setColor(cp.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        color === cp.hex ? 'scale-125 ring-2 ring-indigo-500/20' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: cp.hex, borderColor: color === cp.hex ? '#000' : 'transparent' }}
                      title={cp.label}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
