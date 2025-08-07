'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { Skeleton } from './ui/skeleton'; // Your custom skeleton from shadcn or similar

export function WithClerkLoading({ children }) {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    // You can build a custom skeleton layout or spinner here
    return (
      <div className="flex justify-center items-center  bg-gray-50 m-3">
        {/* Example skeleton box */}
        <Skeleton className="w-full h-100 rounded-md bg-gray-400/70 animate-pulse"/>
      </div>
    );
  }

  return <>{children}</>;
}
