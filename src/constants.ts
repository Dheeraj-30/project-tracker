
import type { Priority, Status, User } from './types';

export const STATUSES: { value: Status; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'in-review', label: 'In Review' },
  { value: 'done', label: 'Done' },
];

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'critical', label: 'Critical', color: 'bg-red-600 text-white' },
  { value: 'high', label: 'High', color: 'bg-orange-500 text-white' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500 text-white' },
  { value: 'low', label: 'Low', color: 'bg-blue-500 text-white' },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Morgan', initials: 'AM', color: 'bg-blue-500' },
  { id: 'u2', name: 'Jamie Lee', initials: 'JL', color: 'bg-green-500' },
  { id: 'u3', name: 'Taylor Swift', initials: 'TS', color: 'bg-purple-500' },
  { id: 'u4', name: 'Jordan Fisher', initials: 'JF', color: 'bg-pink-500' },
  { id: 'u5', name: 'Casey Kim', initials: 'CK', color: 'bg-indigo-500' },
  { id: 'u6', name: 'Riley Park', initials: 'RP', color: 'bg-amber-500' },
];

export const STATUS_COLORS: Record<Status, string> = {
  todo: 'bg-gray-100 border-gray-200',
  'in-progress': 'bg-blue-50 border-blue-200',
  'in-review': 'bg-purple-50 border-purple-200',
  done: 'bg-green-50 border-green-200',
};