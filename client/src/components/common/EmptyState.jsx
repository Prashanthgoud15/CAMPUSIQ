import React from 'react';
import { BookOpen } from 'lucide-react';

const EmptyState = ({ message, icon: Icon = BookOpen }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gpcet-bg/30 rounded-3xl border border-dashed border-gpcet-border">
      <div className="bg-gpcet-card p-4 rounded-full border border-gpcet-border shadow-inner mb-4">
        <Icon size={32} className="text-gpcet-primary opacity-50" />
      </div>
      <p className="text-gpcet-muted font-medium max-w-sm leading-relaxed">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
