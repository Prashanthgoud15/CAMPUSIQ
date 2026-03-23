import React from 'react';

const SkeletonCard = () => (
  <div className="bg-gpcet-card rounded-xl border border-gpcet-border p-5 h-full animate-pulse flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="w-20 h-5 bg-gpcet-bg rounded"></div>
      <div className="w-12 h-5 bg-gpcet-bg rounded"></div>
    </div>
    <div className="w-3/4 h-5 bg-gpcet-bg/50 rounded mb-2"></div>
    <div className="w-1/2 h-5 bg-gpcet-bg/50 rounded mb-4"></div>
    
    <div className="mt-auto pt-4 space-y-3">
      <div className="w-24 h-6 bg-gpcet-bg rounded"></div>
      <div className="flex gap-2 pt-3 border-t border-gpcet-border/50">
        <div className="flex-1 h-9 bg-gpcet-bg rounded-xl"></div>
        <div className="flex-1 h-9 bg-gpcet-bg rounded-xl"></div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
