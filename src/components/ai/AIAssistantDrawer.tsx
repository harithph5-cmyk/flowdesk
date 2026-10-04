import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { parseNaturalLanguageInput } from '../../utils/aiParser';
import { Task, Meeting } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  createdTask?: Partial<Task>;
  createdMeeting?: Partial<Meeting>;
  timestamp: string;
}

export const AIAssistantDrawer: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    projects,
    addTask,
    addMeeting,
    setIsSmartPlanOpen,
    triggerConfetti,
  } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-0',
      sender: 'ai',
      text: '👋 Hey Hari! I am FlowDesk AI. Tell me what you need to schedule, add, or prioritize today. Try asking me:\n\n• "Tomorrow I need to finish the Beyond Books website."\n• "Meeting with Royal Hardwares at 3 PM tomorrow."\n• "I have too many tasks today. What should I do first?"',
      timestamp: 'Just now',
    },
  ]);

  if (!isAIAssistantOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Process with AI parser
    setTimeout(() => {
      const parsed = parseNaturalLanguageInput(query, projects);

      if (parsed.type === 'meeting' && parsed.meetingData) {
        const newMeeting = addMeeting({
          title: parsed.meetingData.title || 'Client Meeting',
          date: parsed.meetingData.date || '',
          startTime: parsed.meetingData.startTime || '10:00',
          endTime: parsed.meetingData.endTime || '10:45',
          duration: parsed.meetingData.duration || 45,
          client: parsed.meetingData.client,
          meetingType: parsed.meetingData.meetingType || 'virtual',
          meetingLink: parsed.meetingData.meetingLink,
        });

        triggerConfetti();

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `📅 Scheduled meeting: **${newMeeting.title}** for ${newMeeting.date} at ${newMeeting.startTime}${newMeeting.client ? ` with ${newMeeting.client}` : ''}. Added to your calendar!`,
          createdMeeting: newMeeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else if (parsed.type === 'task' && parsed.taskData) {
        const newTask = addTask({
          title: parsed.taskData.title || 'New Task',
          description: parsed.taskData.description,
          status: 'todo',
          priority: parsed.taskData.priority || 'medium',
          projectId: parsed.taskData.projectId || projects[0]?.id || '',
          dueDate: parsed.taskData.dueDate || '',
          dueTime: parsed.taskData.dueTime,
          estimatedDuration: parsed.taskData.estimatedDuration || 45,
          tags: parsed.taskData.tags || ['ai-created'],
        });

        triggerConfetti();

        const proj = projects.find((p) => p.id === newTask.projectId);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `✅ Task created: **${newTask.title}** (Project: ${proj?.name || 'General'}, Due: ${newTask.dueDate}, Priority: ${newTask.priority.toUpperCase()}). Added to your task board!`,
          createdTask: newTask,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: parsed.adviceText || "I've analyzed your workflow. Click 'Plan My Day' to structure your schedule, or tell me another task to capture!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    }, 350);
  };

  const sampleChips = [
    'Tomorrow I need to finish the Beyond Books website',
    'Meeting with Royal Hardwares at 3 PM tomorrow',
    'I have too many tasks today. What should I do first?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-xl shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">FlowDesk AI</h3>
              <p className="text-[11px] text-slate-500 font-medium">Natural language workflow copilot</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIAssistantOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {m.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] p-3 rounded-2xl whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs shadow-2xs'
                }`}
              >
                {m.text}

                {m.createdTask && (
                  <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 text-slate-800 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Added to Task Board</span>
                  </div>
                )}

                {m.createdMeeting && (
                  <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 text-slate-800 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Added to Calendar</span>
                  </div>
                )}

                <span className="block text-[9px] text-slate-400 mt-1 text-right">
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">
            Quick Prompts
          </p>
          <div className="flex flex-col gap-1.5">
            {sampleChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="text-left text-[11px] p-2 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 rounded-xl transition-all font-medium truncate"
              >
                💡 {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type task, meeting or question..."
            className="flex-1 px-3.5 py-2 text-xs bg-slate-100 border border-slate-200/80 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
