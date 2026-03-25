import React, { useRef, useEffect} from 'react';
import type { Task, Priority } from '../types';
// import { PRIORITIES } from '../constants';

interface TimelineViewProps {
  tasks: Task[];
}

const DAY_WIDTH = 40;
const DAYS_TO_SHOW = 60; // current month +/- 15 days

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // const [scrollLeft, setScrollLeft] = useState(0);
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 15);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 44); // total 60 days

  const getXForDate = (date: Date) => {
    const diffDays = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    return diffDays * DAY_WIDTH;
  };

  const todayX = getXForDate(today);

  useEffect(() => {
    if (containerRef.current && todayX) {
      containerRef.current.scrollLeft = todayX - 200;
    }
  }, []);

  const priorityColors: Record<Priority, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  return (
    <div className="border rounded-lg bg-white overflow-x-auto" ref={containerRef} style={{ height: 'calc(100vh - 200px)' }}>
      <div style={{ width: DAYS_TO_SHOW * DAY_WIDTH, position: 'relative', minHeight: '500px' }}>
        {/* Timeline header */}
        <div className="sticky top-0 bg-white z-10 border-b">
          {Array.from({ length: DAYS_TO_SHOW }).map((_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const isToday = date.toDateString() === today.toDateString();
            return (
              <div
                key={i}
                style={{ left: i * DAY_WIDTH, width: DAY_WIDTH, position: 'absolute', top: 0 }}
                className={`text-xs text-center py-1 border-r ${isToday ? 'bg-blue-50 font-bold' : ''}`}
              >
                {date.getDate()}/{date.getMonth()+1}
              </div>
            );
          })}
        </div>

        {/* Today marker */}
        <div className="absolute top-0 bottom-0 w-px bg-red-500 z-20" style={{ left: todayX }} />

        {/* Task bars */}
        <div className="mt-8 space-y-2">
          {tasks.map((task, idx) => {
            const start = task.startDate ? getXForDate(task.startDate) : getXForDate(task.dueDate);
            const end = getXForDate(task.dueDate);
            const width = Math.max(2, end - start);
            const left = start;
            const color = priorityColors[task.priority];
            return (
              <div key={task.id} className="relative h-8" style={{ top: idx * 32 }}>
                <div
                  className={`absolute rounded-full ${color} text-white text-xs px-2 py-1 truncate`}
                  style={{ left, width, height: 24, lineHeight: '24px' }}
                  title={task.title}
                >
                  {task.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};