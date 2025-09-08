'use client';
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { formatPathname } from '@/lib/formatPathName';

const Page = () => {
  const pathname = usePathname();
  const paths = formatPathname(pathname);

  return (
    <div className="mt-15">
      <div className="text-green-800  text-xl flex items-center gap-1">
        {paths.length > 1 ? (
          <>
            <div className="font-semibold">{paths[0]}</div>
            <ChevronRight className="w-4 h-4 text-green-800" />
            <div className='font-bold'>{paths[1]}</div>
          </>
        ) : (
          <div>{paths[0]}</div>
        )}
      </div>
    </div>
  );
};

export default Page;
