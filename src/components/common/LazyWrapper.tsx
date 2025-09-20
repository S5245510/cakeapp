'use client';

import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { LoadingSkeleton } from '@/components/ui/loading';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  once?: boolean;
}

export function LazyWrapper({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '100px',
  className,
  once = true,
}: LazyWrapperProps) {
  const { elementRef, isVisible, hasBeenVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: once,
  });

  const shouldRender = once ? hasBeenVisible : isVisible;

  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className={className}>
      {shouldRender ? children : (fallback || <LoadingSkeleton lines={3} />)}
    </div>
  );
}