import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Users, Settings, BarChart3, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Upload Materials',
      desc: 'Add new PDFs, notes, or assignment guides to the vault',
      icon: <Upload size={24} />,
      link: '/admin/upload',
      color: 'text-gpcet-primary bg-gpcet-primary/10'
    },
    {
      title: 'Manage Notes',
      desc: 'View, edit, or remove existing study materials',
      icon: <FileText size={24} />,
      link: '/notes',
      color: 'text-gpcet-accent bg-gpcet-accent/10'
    },
    {
      title: 'Student Analytics',
      desc: 'Monitor engagement and popular study topics',
      icon: <BarChart3 size={24} />,
      link: '#',
      color: 'text-gpcet-nptel bg-gpcet-nptel/10'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2">Admin Control Center</h1>
        <p className="text-gpcet-muted font-medium">Manage the GPCET CampusIQ knowledge base and student resources.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div 
            key={idx}
            className="group bg-gpcet-card rounded-3xl border border-gpcet-border p-8 hover:border-gpcet-primary/50 transition-all hover:-translate-y-1 shadow-xl flex flex-col h-full"
          >
            <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mb-6 shadow-inner`}>
              {card.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
            <p className="text-gpcet-muted text-sm leading-relaxed mb-8 flex-1">{card.desc}</p>
            
            <button 
              onClick={() => navigate(card.link)}
              className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white group-hover:text-gpcet-primary transition-colors"
            >
              Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gpcet-bg rounded-3xl border border-gpcet-border p-8 border-dashed flex flex-col items-center justify-center text-center opacity-60">
           <Users size={32} className="text-gpcet-muted mb-4" />
           <p className="text-sm font-medium text-gpcet-muted italic">User management features coming soon...</p>
        </div>
        <div className="bg-gpcet-bg rounded-3xl border border-gpcet-border p-8 border-dashed flex flex-col items-center justify-center text-center opacity-60">
           <Settings size={32} className="text-gpcet-muted mb-4" />
           <p className="text-sm font-medium text-gpcet-muted italic">System configurations coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
