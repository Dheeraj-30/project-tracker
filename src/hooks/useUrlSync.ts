
import { useEffect, useRef } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import type{ FilterState } from '../types';

const serializeFilters = (filters: FilterState): string => {
  const params = new URLSearchParams();
  if (filters.statuses.length) params.set('statuses', filters.statuses.join(','));
  if (filters.priorities.length) params.set('priorities', filters.priorities.join(','));
  if (filters.assigneeIds.length) params.set('assignees', filters.assigneeIds.join(','));
  if (filters.dueDateFrom) params.set('from', filters.dueDateFrom.toISOString());
  if (filters.dueDateTo) params.set('to', filters.dueDateTo.toISOString());
  return params.toString();
};

const deserializeFilters = (search: string): Partial<FilterState> => {
  const params = new URLSearchParams(search);
  const filters: Partial<FilterState> = {};
  const statuses = params.get('statuses');
  if (statuses) filters.statuses = statuses.split(',') as any;
  const priorities = params.get('priorities');
  if (priorities) filters.priorities = priorities.split(',') as any;
  const assignees = params.get('assignees');
  if (assignees) filters.assigneeIds = assignees.split(',');
  const from = params.get('from');
  if (from) filters.dueDateFrom = new Date(from);
  const to = params.get('to');
  if (to) filters.dueDateTo = new Date(to);
  return filters;
};

export const useUrlSync = () => {
  const filters = useTaskStore((state) => state.filters);
  const setFilters = useTaskStore((state) => state.setFilters);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      const urlFilters = deserializeFilters(window.location.search);
      if (Object.keys(urlFilters).length) setFilters(urlFilters);
      isInitialMount.current = false;
    }
  }, [setFilters]);

  useEffect(() => {
    if (isInitialMount.current) return;
    const query = serializeFilters(filters);
    const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
    window.history.pushState({}, '', newUrl);
  }, [filters]);
};