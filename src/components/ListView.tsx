import React, { useState } from 'react';
import { useVirtualScroll } from '../hooks/useVirtualScroll';
import { useTaskStore } from '../store/useTaskStore';
import { useCollaborationStore } from '../store/useCollaborationStore';
import type { Task, Status } from '../types';
import { STATUSES, USERS } from '../constants';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

const ROW_HEIGHT = 56;

interface ListViewProps {
  tasks: Task[];
}

export const ListView: React.FC<ListViewProps> = ({ tasks }) => {
  const [sortBy, setSortBy] = useState<'title' | 'priority' | 'dueDate'>('dueDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const updateTask = useTaskStore((state) => state.updateTask);
  const collaborators = useCollaborationStore((state) => state.collaborators);

  const sortedTasks = [...tasks].sort((a, b) => {
    let aVal: any, bVal: any;
    if (sortBy === 'title') { aVal = a.title; bVal = b.title; }
    else if (sortBy === 'priority') {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      aVal = order[a.priority]; bVal = order[b.priority];
    } else {
      aVal = a.dueDate.getTime(); bVal = b.dueDate.getTime();
    }
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const handleSort = (field: 'title' | 'priority' | 'dueDate') => {
    if (sortBy === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  const { containerRef, handleScroll, totalHeight, startIndex, endIndex, offsetY } = useVirtualScroll({
    totalItems: sortedTasks.length,
    itemHeight: ROW_HEIGHT,
    overscan: 5,
  });

  const visibleTasks = sortedTasks.slice(startIndex, endIndex + 1);

  const getStatusDropdown = (task: Task) => (
    <select
      value={task.status}
      onChange={(e) => updateTask(task.id, { status: e.target.value as Status })}
      className="border rounded px-2 py-1 text-sm bg-white"
    >
      {STATUSES.map(s => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );

  const formatDueDate = (date: Date) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const due = new Date(date); due.setHours(0,0,0,0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 0) return 'Due Today';
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)}d`;
    return due.toLocaleDateString();
  };

  const getViewers = (taskId: string) => collaborators.filter(c => c.currentTaskId === taskId);

  return (
    <div className="overflow-auto border rounded-lg bg-white" ref={containerRef} onScroll={handleScroll} style={{ height: 'calc(100vh - 240px)' }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <table className="w-full border-collapse" style={{ transform: `translateY(${offsetY}px)` }}>
          <thead className="bg-gray-50 sticky top-0">
            <tr className="border-b">
              <th className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('title')}>
                Title {sortBy === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left">Assignee</th>
              <th className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('priority')}>
                Priority {sortBy === 'priority' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('dueDate')}>
                Due Date {sortBy === 'dueDate' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleTasks.map(task => {
              const assignee = USERS.find(u => u.id === task.assigneeId);
              const viewers = getViewers(task.id);
              return (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      {task.title}
                      {viewers.length > 0 && (
                        <div className="flex -space-x-1">
                          {viewers.slice(0,2).map(v => (
                            <Avatar key={v.id} name={v.name} initials={v.initials} color={v.color} size="sm" />
                          ))}
                          {viewers.length > 2 && <span className="text-xs">+{viewers.length-2}</span>}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {assignee ? <Avatar name={assignee.name} initials={assignee.initials} color={assignee.color} size="sm" /> : '-'}
                  </td>
                  <td className="px-4 py-2"><Badge priority={task.priority} /></td>
                  <td className="px-4 py-2 text-sm">{formatDueDate(task.dueDate)}</td>
                  <td className="px-4 py-2">{getStatusDropdown(task)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};