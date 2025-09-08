'use client';
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { formatPathname } from '@/lib/formatPathName';

import Sanscript from "sanscript";

const DEVANAGARI_FONT = {
  fontFamily: "'Noto Sans Devanagari', 'Noto Serif Devanagari', serif"
};

const renderSanskrit = (word) => {
  // Convert IAST/ITRANS Romanized text to Devanagari
  const devanagariWord = Sanscript.t(word, "iast", "devanagari");

  return (
    <span style={DEVANAGARI_FONT} className="text-lg font-bold tracking-wide">
      {devanagariWord}
    </span>
  );
};


const Page = () => {
  const pathname = usePathname();
  const paths = formatPathname(pathname);

  return (
    <div className="mt-24 sm:mt-22">
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
      {/* <div>{renderSanskrit("citraka")}</div> */}
    </div>
  );
};

export default Page;
