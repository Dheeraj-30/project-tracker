import React from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { STATUSES, PRIORITIES, USERS } from '../constants';
import { Button } from './Button';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, clearFilters } = useTaskStore();
  const hasActiveFilters = Object.values(filters).some(v => (Array.isArray(v) ? v.length > 0 : v !== null));

  const toggleStatus = (status: string) => {
    const current = filters.statuses;
    const next = current.includes(status as any)
      ? current.filter(s => s !== status)
      : [...current, status as any];
    setFilters({ statuses: next });
  };

  const togglePriority = (priority: string) => {
    const current = filters.priorities;
    const next = current.includes(priority as any)
      ? current.filter(p => p !== priority)
      : [...current, priority as any];
    setFilters({ priorities: next });
  };

  const toggleAssignee = (assigneeId: string) => {
    const current = filters.assigneeIds;
    const next = current.includes(assigneeId)
      ? current.filter(id => id !== assigneeId)
      : [...current, assigneeId];
    setFilters({ assigneeIds: next });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex flex-wrap gap-6">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Status</div>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button
                key={s.value}
                onClick={() => toggleStatus(s.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.statuses.includes(s.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Priority</div>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map(p => (
              <button
                key={p.value}
                onClick={() => togglePriority(p.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.priorities.includes(p.value)
                    ? `${p.color} ring-2 ring-offset-1 ring-blue-400`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Assignee</div>
          <div className="flex flex-wrap gap-2">
            {USERS.map(u => (
              <button
                key={u.id}
                onClick={() => toggleAssignee(u.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.assigneeIds.includes(u.id)
                    ? `${u.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {u.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Due Date</div>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={filters.dueDateFrom ? filters.dueDateFrom.toISOString().slice(0,10) : ''}
              onChange={(e) => setFilters({ dueDateFrom: e.target.value ? new Date(e.target.value) : null })}
              className="border rounded px-2 py-1 text-sm"
            />
            <span>to</span>
            <input
              type="date"
              value={filters.dueDateTo ? filters.dueDateTo.toISOString().slice(0,10) : ''}
              onChange={(e) => setFilters({ dueDateTo: e.target.value ? new Date(e.target.value) : null })}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>Clear all filters</Button>
        </div>
      )}
    </div>
  );
};