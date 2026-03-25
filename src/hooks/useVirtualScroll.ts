import { useState, useRef, useCallback } from 'react';

interface UseVirtualScrollProps {
  totalItems: number;
  itemHeight: number;
  overscan?: number;
}

export const useVirtualScroll = ({ totalItems, itemHeight, overscan = 5 }: UseVirtualScrollProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = totalItems * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(totalItems - 1, Math.ceil((scrollTop + (containerRef.current?.clientHeight || 0)) / itemHeight) + overscan);
  const visibleItems = endIndex - startIndex + 1;
  const offsetY = startIndex * itemHeight;

  return {
    containerRef,
    handleScroll,
    totalHeight,
    startIndex,
    endIndex,
    visibleItems,
    offsetY,
  };
};