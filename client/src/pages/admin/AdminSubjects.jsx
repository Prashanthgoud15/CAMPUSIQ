import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Filter, ChevronRight, ChevronDown, 
  BookOpen, CreditCard, Layers, ExternalLink, Hash, ListOrdered,
  BookMarked, Loader2, Save, X, ToggleLeft, ToggleRight
} from 'lucide-react';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../../services/subjectsService';
import toast from 'react-hot-toast';

const BRANCHES = ['CSE', 'CAI', 'ECE', 'EEE', 'CIVIL', 'MECH'];
const YEARS = [1, 2, 3, 4];
const SEMESTERS = [1, 2];
const TYPES = [
  { id: 'regular', label: 'Regular', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'nptel', label: 'NPTEL', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  { id: 'lab', label: 'Lab', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'elective', label: 'Elective', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
];

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ branch: 'All', year: 'All', semester: 'All' });
  const [expandedGroups, setExpandedGroups] = useState({});
  const [formData, setFormData] = useState({
    branch: '',
    year: 1,
    semester: 1,
    subject_code: '',
    subject_name: '',
    type: 'regular',
    credits: 3,
    is_theory: true,
    nptel_course_url: '',
    nptel_weeks_total: 12,
    regulation: 'R23',
    order: 1
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await getSubjects();
      setSubjects(data);
      
      // Expand all groups by default
      const initialExpanded = {};
      data.forEach(s => {
        initialExpanded[`${s.year}-${s.semester}`] = true;
      });
      setExpandedGroups(initialExpanded);
    } catch (err) {
      toast.error('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;
    
    if (name === 'subject_code') finalValue = value.toUpperCase();
    if (['year', 'semester', 'credits', 'order', 'nptel_weeks_total'].includes(name)) finalValue = parseInt(value);

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const resetForm = () => {
    setFormData({
      branch: '',
      year: 1,
      semester: 1,
      subject_code: '',
      subject_name: '',
      type: 'regular',
      credits: 3,
      is_theory: true,
      nptel_course_url: '',
      nptel_weeks_total: 12,
      regulation: 'R23',
      order: 1
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await updateSubject(editingId, formData);
        toast.success('Subject updated successfully!');
      } else {
        await createSubject(formData);
        toast.success('Subject added successfully!');
      }
      resetForm();
      fetchSubjects();
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject._id);
    setFormData({
      branch: subject.branch,
      year: subject.year,
      semester: subject.semester,
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
      type: subject.type,
      credits: subject.credits,
      is_theory: subject.is_theory,
      nptel_course_url: subject.nptel_course_url || '',
      nptel_weeks_total: subject.nptel_weeks_total || 12,
      regulation: subject.regulation,
      order: subject.order
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) return;
    try {
      await deleteSubject(id);
      toast.success('Subject deleted');
      fetchSubjects();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete';
      toast.error(message);
    }
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const filteredSubjects = subjects.filter(s => {
    const branchMatch = filters.branch === 'All' || s.branch === filters.branch;
    const yearMatch = filters.year === 'All' || s.year === parseInt(filters.year);
    const semMatch = filters.semester === 'All' || s.semester === parseInt(filters.semester);
    return branchMatch && yearMatch && semMatch;
  });

  const groupedSubjects = filteredSubjects.reduce((acc, s) => {
    const key = `Year ${s.year} - Semester ${s.semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gpcet-text mb-2">Subject Management</h1>
        <p className="text-gpcet-muted font-medium">Create and organize curriculum subjects for all branches.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Section - List (40%) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gpcet-card rounded-3xl border border-gpcet-border p-6 shadow-xl sticky top-8">
             <div className="flex items-center gap-2 mb-6">
               <div className="p-2 bg-gpcet-primary/10 rounded-xl text-gpcet-primary border border-gpcet-primary/20">
                 <Filter size={18} />
               </div>
               <h2 className="text-xl font-black text-gpcet-text">Filter Subjects</h2>
             </div>

             <div className="space-y-4">
               <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-gpcet-muted mb-1.5 block">Branch</label>
                 <select 
                   value={filters.branch}
                   onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
                   className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-2.5 text-sm text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none transition-all shadow-inner"
                 >
                   <option value="All">All Branches</option>
                   {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-gpcet-muted mb-1.5 block">Year</label>
                   <select 
                     value={filters.year}
                     onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                     className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-2.5 text-sm text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none transition-all shadow-inner"
                   >
                     <option value="All">All Years</option>
                     {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-gpcet-muted mb-1.5 block">Semester</label>
                   <select 
                     value={filters.semester}
                     onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                     className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-2.5 text-sm text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none transition-all shadow-inner"
                   >
                     <option value="All">All Semesters</option>
                     {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </div>
               </div>
             </div>

             <div className="mt-8 space-y-4">
               {loading ? (
                 <div className="flex flex-col items-center justify-center py-10 opacity-50">
                   <Loader2 size={24} className="animate-spin mb-2" />
                   <span className="text-xs font-bold">Syncing Subjects...</span>
                 </div>
               ) : Object.keys(groupedSubjects).length === 0 ? (
                 <div className="text-center py-10">
                   <BookOpen size={40} className="mx-auto text-gpcet-border mb-4 opacity-50" />
                   <p className="text-gpcet-muted font-bold text-sm">No subjects found for these filters</p>
                 </div>
               ) : (
                 Object.entries(groupedSubjects).map(([groupKey, groupSubjects]) => (
                   <div key={groupKey} className="border border-gpcet-border rounded-2xl overflow-hidden shadow-sm">
                     <button 
                       onClick={() => toggleGroup(groupKey)}
                       className="w-full flex items-center justify-between p-4 bg-gpcet-bg hover:bg-white/5 transition-all text-left group"
                     >
                       <span className="text-xs font-black uppercase tracking-widest text-gpcet-muted group-hover:text-gpcet-primary">{groupKey}</span>
                       {expandedGroups[groupKey] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                     </button>
                     {expandedGroups[groupKey] && (
                       <div className="p-2 space-y-2">
                         {groupSubjects.map(s => (
                           <div key={s._id} className="p-3 bg-gpcet-card rounded-xl border border-gpcet-border hover:border-gpcet-primary/30 transition-all flex items-center justify-between gap-3 shadow-inner">
                             <div className="overflow-hidden">
                               <p className="text-white font-bold text-xs truncate">{s.subject_name}</p>
                               <div className="flex items-center gap-2 mt-1 flex-wrap">
                                 <span className="text-[10px] font-mono text-gpcet-muted">{s.subject_code}</span>
                                 <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase border ${TYPES.find(t => t.id === s.type)?.color || ''}`}>
                                   {s.type}
                                 </span>
                                 <span className="bg-gpcet-bg px-1 py-0.5 rounded text-[9px] font-bold text-gray-500 border border-gpcet-border">
                                   {s.credits} CR
                                 </span>
                               </div>
                             </div>
                             <div className="flex items-center gap-1.5 shrink-0">
                               <button 
                                 onClick={() => handleEdit(s)}
                                 className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/10 transition-all"
                               >
                                 <Edit2 size={12} />
                               </button>
                               <button 
                                 onClick={() => handleDelete(s._id, s.subject_name)}
                                 className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/10 transition-all"
                               >
                                 <Trash2 size={12} />
                               </button>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>

        {/* Right Section - Form (60%) */}
        <div className="lg:col-span-7">
          <div className="bg-gpcet-card rounded-3xl border border-gpcet-border p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-10">
              <div className={`p-3 rounded-2xl border ${editingId ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-gpcet-primary/10 text-gpcet-primary border-gpcet-primary/20'}`}>
                {editingId ? <Edit2 size={24} /> : <Plus size={24} />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gpcet-text">{editingId ? 'Edit Subject' : 'Add New Subject'}</h2>
                <p className="text-gpcet-muted text-sm font-medium">
                  {editingId ? 'Modify existing subject details.' : 'Fill in the information to register a new course.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Row 1: Branch, Year, Semester */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1">Branch</label>
                  <select 
                    name="branch" required
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-3 text-sm text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner"
                  >
                    <option value="" disabled>Select Branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1">Year</label>
                  <select 
                    name="year" required
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-3 text-sm text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner"
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1">Semester</label>
                  <select 
                    name="semester" required
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-3 text-sm text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner"
                  >
                    {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2: Code, Credits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1 flex items-center gap-1.5">
                    <Hash size={12} /> Subject Code
                  </label>
                  <input 
                    type="text" name="subject_code" required
                    placeholder="e.g. 23CS3201"
                    value={formData.subject_code}
                    onChange={handleInputChange}
                    className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-3 text-sm text-gpcet-text font-mono focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1 flex items-center gap-1.5">
                    <CreditCard size={12} /> Credits
                  </label>
                  <input 
                    type="number" name="credits" required min="1" max="8"
                    value={formData.credits}
                    onChange={handleInputChange}
                    className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-3 text-sm text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner"
                  />
                </div>
              </div>

              {/* Row 3: Name */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1 flex items-center gap-1.5">
                  <BookMarked size={12} /> Subject Name
                </label>
                <input 
                  type="text" name="subject_name" required
                  placeholder="e.g. Software Engineering and Project Management"
                  value={formData.subject_name}
                  onChange={handleInputChange}
                  className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-3 text-sm text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner font-bold"
                />
              </div>

              {/* Row 4: Subject Type */}
              <div className="space-y-4">
                 <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1 block">Subject Type</label>
                 <div className="flex flex-wrap gap-4">
                   {TYPES.map(type => (
                     <label key={type.id} className="flex items-center gap-2 cursor-pointer group">
                       <input 
                         type="radio" name="type" value={type.id}
                         checked={formData.type === type.id}
                         onChange={handleInputChange}
                         className="hidden"
                       />
                       <div className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all flex items-center gap-2 min-w-[100px] justify-center
                         ${formData.type === type.id 
                           ? type.color.replace('/10', '/30') 
                           : 'bg-gpcet-bg border-gpcet-border text-gpcet-muted hover:bg-white/5'}`}
                       >
                         {type.label}
                       </div>
                     </label>
                   ))}
                 </div>
              </div>

              {/* Row 5: NPTEL Fields */}
              {formData.type === 'nptel' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-green-500/5 rounded-3xl border border-green-500/10 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-green-400 ml-1 flex items-center gap-1.5">
                      <ExternalLink size={12} /> NPTEL Course URL
                    </label>
                    <input 
                      type="url" name="nptel_course_url"
                      placeholder="https://nptel.ac.in/courses/..."
                      value={formData.nptel_course_url}
                      onChange={handleInputChange}
                      className="w-full bg-gpcet-bg border border-green-500/20 rounded-xl px-4 py-3 text-sm text-gpcet-text focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-green-400 ml-1 flex items-center gap-1.5">
                      <Layers size={12} /> Total Weeks
                    </label>
                    <input 
                      type="number" name="nptel_weeks_total"
                      value={formData.nptel_weeks_total}
                      onChange={handleInputChange}
                      className="w-full bg-gpcet-bg border border-green-500/20 rounded-xl px-4 py-3 text-sm text-gpcet-text focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Row 6: Regulation, Order, Theory Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1">Regulation</label>
                  <input 
                    type="text" value={formData.regulation} readOnly
                    className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-3 text-sm text-gray-500 font-mono shadow-inner cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1 flex items-center gap-1.5">
                    <ListOrdered size={12} /> Display Order
                  </label>
                  <input 
                    type="number" name="order" required min="1"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-3 text-sm text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1">Is Theory Course?</label>
                  <button 
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, is_theory: !p.is_theory }))}
                    className={`flex items-center gap-3 w-fit px-4 py-2.5 rounded-xl border transition-all ${formData.is_theory ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}
                  >
                    {formData.is_theory ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    <span className="text-sm font-bold">{formData.is_theory ? 'Yes (Theory)' : 'No (Practical)'}</span>
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button 
                  type="submit" disabled={submitting}
                  className="flex-1 bg-gpcet-primary hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      {editingId ? <Save size={20} /> : <Plus size={20} />}
                      {editingId ? 'Update Subject' : 'Add Subject'}
                    </>
                  )}
                </button>
                {editingId && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-4 rounded-2xl border border-gpcet-border text-gpcet-muted font-bold hover:bg-white/5 transition-all flex items-center gap-2"
                  >
                    <X size={20} /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubjects;
