import React from 'react';

const SkeletonRow = () => (
  <div className="w-full text-left p-3 rounded-xl mb-2 border border-transparent bg-gpcet-card animate-pulse">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2 h-2 rounded-full bg-gpcet-bg/50"></div>
      <div className="w-16 h-3 bg-gpcet-bg/50 rounded"></div>
      <div className="ml-auto w-12 h-3 bg-gpcet-bg/50 rounded"></div>
    </div>
    <div className="w-3/4 h-4 bg-gpcet-bg/50 rounded"></div>
  </div>
);

export default SkeletonRow;
