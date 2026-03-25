import React, { useState } from 'react';
import { useCollaborationStore } from '../store/useCollaborationStore';
import { Avatar } from './Avatar';

export const CollaborationIndicators: React.FC = () => {
  const collaborators = useCollaborationStore((state) => state.collaborators);
  const activeCount = collaborators.filter(c => c.currentTaskId !== null).length;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm"
      >
        <div className="flex -space-x-1">
          {collaborators.slice(0, 3).map(c => (
            <Avatar key={c.id} name={c.name} initials={c.initials} color={c.color} size="sm" />
          ))}
        </div>
        <span>{activeCount} people viewing</span>
      </button>
      {showDetails && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-2 z-10">
          {collaborators.map(c => (
            <div key={c.id} className="flex items-center gap-2 p-2 hover:bg-gray-50">
              <Avatar name={c.name} initials={c.initials} color={c.color} size="sm" />
              <span className="text-sm">{c.name}</span>
              {c.currentTaskId ? (
                <span className="text-xs text-green-600 ml-auto">viewing</span>
              ) : (
                <span className="text-xs text-gray-400 ml-auto">idle</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};