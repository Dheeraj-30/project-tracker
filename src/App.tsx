
import { useState, useEffect } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { TimelineView } from './components/TimelineView';
import { FilterBar } from './components/FilterBar';
import { CollaborationIndicators } from './components/CollaborationIndicators';
import { useTaskStore } from './store/useTaskStore';
import {  startCollaborationSimulation, stopCollaborationSimulation } from './store/useCollaborationStore';
import { useUrlSync } from './hooks/useUrlSync';
import { Button } from './components/Button';
// import { STATUSES, PRIORITIES, USERS } from './constants';

type View = 'kanban' | 'list' | 'timeline';

const filterTasks = (tasks: any[], filters: any) => {
  return tasks.filter(task => {
    if (filters.statuses.length && !filters.statuses.includes(task.status)) return false;
    if (filters.priorities.length && !filters.priorities.includes(task.priority)) return false;
    if (filters.assigneeIds.length && (!task.assigneeId || !filters.assigneeIds.includes(task.assigneeId))) return false;
    if (filters.dueDateFrom && new Date(task.dueDate) < filters.dueDateFrom) return false;
    if (filters.dueDateTo && new Date(task.dueDate) > filters.dueDateTo) return false;
    return true;
  });
};

function App() {
  const [view, setView] = useState<View>('kanban');
  const { tasks, filters } = useTaskStore();
  const filteredTasks = filterTasks(tasks, filters);
  // const collaborators = useCollaborationStore((state) => state.collaborators);
  
  useUrlSync();

  useEffect(() => {
    const taskIds = tasks.map(t => t.id);
    startCollaborationSimulation(taskIds);
    return () => stopCollaborationSimulation();
  }, [tasks]);

  const hasNoResults = filteredTasks.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Project Tracker</h1>
          <div className="flex gap-2">
            <Button variant={view === 'kanban' ? 'primary' : 'outline'} onClick={() => setView('kanban')}>Kanban</Button>
            <Button variant={view === 'list' ? 'primary' : 'outline'} onClick={() => setView('list')}>List</Button>
            <Button variant={view === 'timeline' ? 'primary' : 'outline'} onClick={() => setView('timeline')}>Timeline</Button>
          </div>
          <CollaborationIndicators />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <FilterBar />
        <div className="mt-6">
          {hasNoResults ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">No tasks match the current filters.</p>
              <Button variant="primary" onClick={() => useTaskStore.getState().clearFilters()}>Clear Filters</Button>
            </div>
          ) : (
            <>
              {view === 'kanban' && <KanbanBoard />}
              {view === 'list' && <ListView tasks={filteredTasks} />}
              {view === 'timeline' && <TimelineView tasks={filteredTasks} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;