import React, { useState} from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useCollaborationStore } from '../store/useCollaborationStore';
import type { Task, Status } from '../types';
import { STATUSES, USERS, STATUS_COLORS } from '../constants';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface KanbanColumnProps {
  status: Status;
  label: string;
  tasks: Task[];
  onDrop: (taskId: string, newStatus: Status) => void;
  onDragOver: (e: React.DragEvent) => void;
  isDragOver: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, label, tasks, onDrop, onDragOver, isDragOver }) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) onDrop(taskId, status);
  };

  return (
    <div
      className={`flex-1 min-w-[280px] rounded-lg border ${STATUS_COLORS[status]} ${isDragOver ? 'ring-2 ring-blue-400 bg-opacity-50' : ''}`}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      <div className="p-3 border-b bg-white bg-opacity-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">{label}</h3>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{tasks.length}</span>
        </div>
      </div>
      <div className="p-2 space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">No tasks</div>
        ) : (
          tasks.map(task => <KanbanCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};

interface KanbanCardProps {
  task: Task;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const collaborators = useCollaborationStore((state) => state.collaborators);
  const viewers = collaborators.filter(c => c.currentTaskId === task.id);
  const assignee = USERS.find(u => u.id === task.assigneeId);
  
  const formatDueDate = (date: Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(date);
    due.setHours(0,0,0,0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 0) return <span className="text-orange-600 font-medium">Due Today</span>;
    if (diffDays < 0) return <span className="text-red-600">Overdue by {Math.abs(diffDays)}d</span>;
    if (diffDays > 7) return <span className="text-gray-500">{due.toLocaleDateString()}</span>;
    return <span>{due.toLocaleDateString()}</span>;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    // For custom drag image, we can set a ghost but we'll just use default
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white rounded-md shadow-sm p-3 border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-800 text-sm">{task.title}</h4>
        <Badge priority={task.priority} />
      </div>
      <div className="flex justify-between items-center mt-2">
       {assignee ? (
  <Avatar name={assignee.name} initials={assignee.initials} color={assignee.color} size="sm" />
) : (
  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
    ?
  </div>
)}
        <div className="text-xs">{formatDueDate(task.dueDate)}</div>
      </div>
      {viewers.length > 0 && (
        <div className="mt-2 flex -space-x-1">
          {viewers.slice(0, 2).map(v => (
            <Avatar key={v.id} name={v.name} initials={v.initials} color={v.color} size="sm" />
          ))}
          {viewers.length > 2 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center">
              +{viewers.length-2}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const KanbanBoard: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (taskId: string, newStatus: Status) => {
    updateTaskStatus(taskId, newStatus);
    setDragOverColumn(null);
  };

  const groupedTasks = STATUSES.reduce((acc, { value }) => {
    acc[value] = tasks.filter(t => t.status === value);
    return acc;
  }, {} as Record<Status, Task[]>);

  return (
    <div className="flex gap-4 overflow-x-auto p-4 min-h-[calc(100vh-200px)]">
      {STATUSES.map(({ value, label }) => (
       <KanbanColumn
  key={value}
  status={value}
  label={label}
  tasks={groupedTasks[value]}
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  isDragOver={dragOverColumn === value}
/>
      ))}
    </div>
  );
};