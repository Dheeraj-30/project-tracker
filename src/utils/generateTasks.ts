
import type { Task, Status, Priority } from '../types';
import { USERS } from '../constants';

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start: Date, end: Date): Date => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const titles = [
  'Implement authentication', 'Design dashboard', 'Write documentation', 'Fix navigation bug',
  'Optimize image loading', 'Add analytics', 'Create user profile', 'Build notification system',
  'Review pull requests', 'Update dependencies', 'Write unit tests', 'Deploy to staging',
  'Refactor API calls', 'Improve accessibility', 'Design system tokens', 'Mobile responsive fixes'
];

export const generateTasks = (count: number): Task[] => {
  const tasks: Task[] = [];
  const now = new Date();
  const startRange = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endRange = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  for (let i = 0; i < count; i++) {
    const status: Status = randomItem(['todo', 'in-progress', 'in-review', 'done']);
    const priority: Priority = randomItem(['critical', 'high', 'medium', 'low']);
    const assigneeId = Math.random() > 0.2 ? randomItem(USERS).id : null;
    const dueDate = randomDate(startRange, endRange);
    const startDate = Math.random() > 0.3 ? randomDate(new Date(dueDate.getTime() - 14 * 24 * 60 * 60 * 1000), dueDate) : null;
    
    tasks.push({
      id: `task-${i}`,
      title: `${titles[i % titles.length]} ${Math.floor(i / titles.length) + 1}`,
      assigneeId,
      priority,
      status,
      startDate,
      dueDate,
      createdAt: new Date(),
    });
  }
  return tasks;
};