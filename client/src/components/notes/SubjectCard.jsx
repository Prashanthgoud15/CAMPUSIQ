import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, BookOpen, ExternalLink, GraduationCap, FlaskConical, Filter } from 'lucide-react';
import { SUBJECT_TYPES } from '../../constants/gpcet';

const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();
  const typeConfig = SUBJECT_TYPES[subject.type.toUpperCase()] || SUBJECT_TYPES.REGULAR;

  const getTypeIcon = () => {
    switch(subject.type) {
      case 'nptel': return <GraduationCap size={14} className="mr-1" />;
      case 'lab': return <FlaskConical size={14} className="mr-1" />;
      case 'elective': return <Filter size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="bg-gpcet-card rounded-xl border border-gpcet-border p-5 hover:-translate-y-1 transition-transform duration-200 shadow-lg hover:shadow-xl flex flex-col h-full hover:border-gpcet-primary/30 group">
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center ${typeConfig.badge}`}>
          {getTypeIcon()}
          {typeConfig.label}
        </span>
        <span className="text-[11px] font-mono font-medium text-gray-500 bg-[#0A0F1E] px-2 py-0.5 rounded border border-gpcet-border shadow-inner">
          {subject.subject_code}
        </span>
      </div>

      <h3 className="text-white font-bold text-base leading-tight mb-2 line-clamp-2" title={subject.subject_name}>
        {subject.subject_name}
      </h3>

      <div className="mt-auto pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gpcet-muted bg-[#0A0F1E] px-2 py-1 rounded border border-gpcet-border shadow-inner">
            {subject.credits} Credits
          </span>
          {subject.type === 'nptel' && subject.nptel_course_url && (
            <a 
              href={subject.nptel_course_url} 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-medium text-gpcet-nptel bg-green-500/10 px-2 py-1 rounded border border-green-500/20 hover:bg-green-500/30 transition-colors flex items-center shadow-inner"
            >
              Course <ExternalLink size={12} className="ml-1" />
            </a>
          )}
        </div>

        <div className="flex gap-2 pt-3 border-t border-gpcet-border/50">
          <button 
            onClick={() => navigate(`/notes?subject=${subject.subject_code}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border-2 border-gpcet-primary/30 text-gpcet-primary hover:bg-gpcet-primary/10 transition-colors text-xs font-bold shadow-inner hover:border-gpcet-primary/60"
          >
            <BookOpen size={14} /> Notes &rarr;
          </button>
          
          <button 
            onClick={() => navigate(`/meera?subject=${subject.subject_code}&name=${encodeURIComponent(subject.subject_name)}`)}
            className="flex flex-1 items-center justify-center gap-1.5 py-2 px-3 rounded-xl border-2 border-gpcet-accent/30 text-gpcet-accent hover:bg-gpcet-accent/10 transition-colors text-xs font-bold shadow-inner hover:border-gpcet-accent/60"
          >
            <Bot size={14} /> Tutor &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
