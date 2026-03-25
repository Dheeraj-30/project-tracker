import { create } from 'zustand';
import type { Task, FilterState, Status} from '../types';
import { generateTasks } from '../utils/generateTasks';
// import { USERS } from '../constants';

interface TaskStore {
  tasks: Task[];
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
}

const initialFilters: FilterState = {
  statuses: [],
  priorities: [],
  assigneeIds: [],
  dueDateFrom: null,
  dueDateTo: null,
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: generateTasks(500),
  filters: initialFilters,
  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  clearFilters: () => set({ filters: initialFilters }),
  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map((task) => task.id === taskId ? { ...task, status } : task)
  })),
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map((task) => task.id === taskId ? { ...task, ...updates } : task)
  })),
}));