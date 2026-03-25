
export type Status = 'todo' | 'in-progress' | 'in-review' | 'done';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string | null;
  priority: Priority;
  status: Status;
  startDate: Date | null;
  dueDate: Date;
  createdAt: Date;
}

export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assigneeIds: string[];
  dueDateFrom: Date | null;
  dueDateTo: Date | null;
}

export interface Collaborator {
  id: string;
  name: string;
  initials: string;
  color: string;
  currentTaskId: string | null;
}