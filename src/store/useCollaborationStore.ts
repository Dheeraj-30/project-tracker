import { create } from 'zustand';
import type { Collaborator } from '../types';
import { USERS } from '../constants'; // adjust path if constants.ts is elsewhere

const COLLABORATORS: Collaborator[] = USERS.slice(0, 4).map((user) => ({
  ...user,
  currentTaskId: null,
}));

interface CollaborationStore {
  collaborators: Collaborator[];
  updateCollaboratorTask: (userId: string, taskId: string | null) => void;
}

export const useCollaborationStore = create<CollaborationStore>((set) => ({
  collaborators: COLLABORATORS,
  updateCollaboratorTask: (userId, taskId) =>
    set((state) => ({
      collaborators: state.collaborators.map((c) =>
        c.id === userId ? { ...c, currentTaskId: taskId } : c
      ),
    })),
}));

let interval: ReturnType<typeof setInterval> | null = null;

export const startCollaborationSimulation = (taskIds: string[]) => {
  if (interval) clearInterval(interval);
  interval = setInterval(() => {
    const { collaborators, updateCollaboratorTask } = useCollaborationStore.getState();
    if (!taskIds.length) return;
    const randomTaskId = taskIds[Math.floor(Math.random() * taskIds.length)];
    const randomCollaborator = collaborators[Math.floor(Math.random() * collaborators.length)];
    updateCollaboratorTask(randomCollaborator.id, randomTaskId);
  }, 5000);
};

export const stopCollaborationSimulation = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};