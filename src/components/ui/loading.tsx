
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingProps {
  className?: string;
  rows?: number;
}

export const TableLoading = ({ className, rows = 5 }: LoadingProps) => {
  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      ))}
    </div>
  );
};

export const CardLoading = ({ className, rows = 3 }: LoadingProps) => {
  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="border rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const PageLoading = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};
