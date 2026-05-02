import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  BookOpen, Loader2, ExternalLink, Bot,
  BookMarked, Globe, ChevronDown, Info
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import {
  getSubjects, getNotes, viewNote, downloadNote,
  browseSubjects, browseNotes
} from '../services/notesService';
import NoteCard from '../components/notes/NoteCard';
import EmptyState from '../components/common/EmptyState';
import PDFViewer from '../components/notes/PDFViewer';
import SkeletonCard from '../components/common/SkeletonCard';
import SkeletonRow from '../components/common/SkeletonRow';

const BRANCHES = ['CSE', 'CAI', 'ECE', 'EEE', 'CIVIL', 'MECH'];
const YEARS = [1, 2, 3, 4];
const SEMESTERS = [1, 2];

const getTabsForType = (type) => {
  if (type === 'nptel') return ['All', 'Week 1-4', 'Week 5-8', 'Week 9-12', 'Assignments'];
  if (type === 'lab') return ['All', 'Programs', 'Viva Questions', 'Lab Manual'];
  return ['All', 'Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];
};

const Notes = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ─── Main tab: 'my' | 'browse'
  const [mainTab, setMainTab] = useState('my');

  // ─── MY SUBJECTS state ───────────────────────────────────────
  const [subjects, setSubjects] = useState({ regular: [], nptel: [], lab: [], elective: [] });
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeUnitTab, setActiveUnitTab] = useState('All');
  const [notes, setNotes] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  // ─── BROWSE ALL state ─────────────────────────────────────────
  const [browseFilters, setBrowseFilters] = useState({
    branch: user?.branch || 'CSE',
    year: user?.year || 3,
    semester: 1        // default to previous sem so it's useful
  });
  const [browseSubjectList, setBrowseSubjectList] = useState([]);
  const [browseSelectedSubject, setBrowseSelectedSubject] = useState(null);
  const [browseNotesList, setBrowseNotesList] = useState([]);
  const [browseActiveUnitTab, setBrowseActiveUnitTab] = useState('All');
  const [isLoadingBrowseSubjects, setIsLoadingBrowseSubjects] = useState(false);
  const [isLoadingBrowseNotes, setIsLoadingBrowseNotes] = useState(false);

  // ─── Shared ────────────────────────────────────────────────────
  const [viewingPdf, setViewingPdf] = useState(null);

  // ── Load My Subjects ──────────────────────────────────────────
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
        const allList = [...data.regular, ...data.elective, ...data.lab, ...data.nptel];
        const querySubjectCode = searchParams.get('subject');
        if (querySubjectCode) {
          const found = allList.find(s => s.subject_code === querySubjectCode);
          if (found) setSelectedSubject(found);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    if (user?.role === 'student') fetchSubjects();
  }, [searchParams, user]);

  // ── Load My Subject Notes ──────────────────────────────────────
  useEffect(() => {
    if (!selectedSubject) return;
    const fetchNotes = async () => {
      setIsLoadingNotes(true);
      try {
        const data = await getNotes(selectedSubject.subject_code, 'all');
        setNotes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingNotes(false);
      }
    };
    fetchNotes();
  }, [selectedSubject]);

  // ── Load Browse Subjects when filters change ──────────────────
  useEffect(() => {
    if (mainTab !== 'browse') return;
    const fetchBrowseSubjects = async () => {
      setIsLoadingBrowseSubjects(true);
      setBrowseSubjectList([]);
      setBrowseSelectedSubject(null);
      setBrowseNotesList([]);
      try {
        const data = await browseSubjects(browseFilters.branch, browseFilters.year, browseFilters.semester);
        setBrowseSubjectList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingBrowseSubjects(false);
      }
    };
    fetchBrowseSubjects();
  }, [browseFilters, mainTab]);

  // ── Load Browse Notes when subject selected ───────────────────
  useEffect(() => {
    if (!browseSelectedSubject) return;
    const fetchBN = async () => {
      setIsLoadingBrowseNotes(true);
      setBrowseActiveUnitTab('All');
      try {
        const data = await browseNotes(
          browseFilters.branch,
          browseFilters.year,
          browseFilters.semester,
          browseSelectedSubject.subject_code
        );
        setBrowseNotesList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingBrowseNotes(false);
      }
    };
    fetchBN();
  }, [browseSelectedSubject]);

  // ─── Helpers ────────────────────────────────────────────────
  const filteredNotes = notes.filter(n =>
    activeUnitTab === 'All' ? true : n.unit_label.toLowerCase() === activeUnitTab.toLowerCase()
  );

  const filteredBrowseNotes = browseNotesList.filter(n =>
    browseActiveUnitTab === 'All' ? true : n.unit_label.toLowerCase() === browseActiveUnitTab.toLowerCase()
  );

  const handleSelectSubject = (subj) => { setSelectedSubject(subj); setActiveUnitTab('All'); };
  const handleBrowseSelectSubject = (subj) => { setBrowseSelectedSubject(subj); setBrowseActiveUnitTab('All'); };

  const handleViewPdf = async (note) => {
    setViewingPdf(note);
    try { await viewNote(note._id); } catch (e) { console.error(e); }
  };

  const handleDownloadPdf = async (note) => {
    try {
      const blob = await downloadNote(note._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${note.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  const handleBrowseFilterChange = (key, value) => {
    setBrowseFilters(prev => ({ ...prev, [key]: value }));
    setBrowseSelectedSubject(null);
    setBrowseNotesList([]);
  };

  // ─── Subject list renderer (shared between tabs) ─────────────
  const renderSubjectButton = (s, isSelected, onClick) => {
    const typeColor =
      s.type === 'regular' ? 'bg-blue-500 text-blue-500' :
      s.type === 'nptel'   ? 'bg-green-500 text-green-500' :
      s.type === 'lab'     ? 'bg-amber-500 text-amber-500' :
                             'bg-gray-500 text-gray-500';
    return (
      <button
        key={s._id || s.subject_code}
        onClick={() => onClick(s)}
        className={`w-full text-left p-3 rounded-xl mb-2 transition-all border ${
          isSelected
            ? 'bg-blue-500/10 border-blue-500/40 text-gpcet-text shadow-[0_0_15px_rgba(59,130,246,0.1)]'
            : 'bg-transparent border-transparent text-gpcet-muted hover:bg-gpcet-card hover:text-gpcet-text'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${typeColor}`} />
          <span className="font-mono text-[10px] tracking-wider">{s.subject_code}</span>
          <span className={`ml-auto text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded shadow-inner ${
            s.type === 'regular' ? 'bg-blue-900/50 text-blue-300' :
            s.type === 'nptel'   ? 'bg-green-900/50 text-green-300' :
            s.type === 'lab'     ? 'bg-amber-900/50 text-amber-300' :
            'bg-gray-800 text-gray-400'
          }`}>
            {s.type}
          </span>
        </div>
        <p className={`text-sm font-bold truncate ${isSelected ? 'text-blue-400' : ''}`}>
          {s.subject_name}
        </p>
      </button>
    );
  };

  // ─── Shared notes panel ──────────────────────────────────────
  const renderNotesPanel = (subject, filteredN, unitTab, setUnitTab, loading) => {
    if (!subject) return (
      <EmptyState message="Select a subject from the left panel to view its notes." />
    );
    return (
      <div className="flex flex-col h-full bg-gpcet-card rounded-3xl border border-gpcet-border overflow-hidden shadow-lg relative">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gpcet-border bg-gpcet-bg relative overflow-hidden shrink-0">
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 -mr-20 -mt-20 ${
            subject.type === 'nptel' ? 'bg-green-500' : 'bg-gpcet-primary'
          }`} />
          <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs font-bold text-gray-400 bg-gpcet-card border border-gpcet-border px-2 py-0.5 rounded shadow-inner">
                  {subject.subject_code}
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-gpcet-muted bg-gpcet-card border border-gpcet-border px-2 py-0.5 rounded shadow-inner">
                  {subject.credits} Credits
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gpcet-text tracking-tight leading-tight">
                {subject.subject_name}
              </h2>
            </div>
            <div className="flex gap-3">
              {subject.type === 'nptel' && subject.nptel_course_url && (
                <a
                  href={subject.nptel_course_url} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-green-500/30 hover:border-green-500 shadow-inner"
                >
                  <ExternalLink size={16} /> Open NPTEL
                </a>
              )}
              <button
                onClick={() => navigate(`/meera?subject=${subject.subject_code}&name=${encodeURIComponent(subject.subject_name)}`)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-gpcet-accent/10 to-gpcet-card border border-gpcet-accent/30 hover:border-gpcet-accent/60 text-gpcet-accent hover:text-indigo-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                <Bot size={16} /> Ask Meera
              </button>
            </div>
          </div>
        </div>

        {/* Unit Tabs */}
        <div className="px-6 py-4 border-b border-gpcet-border bg-gpcet-bg shrink-0 overflow-x-auto custom-scrollbar shadow-inner">
          <div className="flex gap-2 whitespace-nowrap">
            {getTabsForType(subject.type).map(tab => {
              let activeClass = 'bg-gpcet-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] border-gpcet-primary/80';
              if (subject.type === 'nptel') activeClass = 'bg-gpcet-nptel text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] border-green-400';
              if (subject.type === 'lab')   activeClass = 'bg-gpcet-warning text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] border-amber-400';
              return (
                <button
                  key={tab}
                  onClick={() => setUnitTab(tab)}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border shadow-inner ${
                    unitTab === tab ? activeClass : 'bg-gpcet-card border-gpcet-border text-gpcet-muted hover:bg-gpcet-bg hover:text-gpcet-text'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar relative bg-gpcet-bg/50">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredN.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <EmptyState message={`No notes yet for ${subject.subject_code}. Check back soon.`} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {filteredN.map(note => (
                <NoteCard key={note._id} note={note} onView={handleViewPdf} onDownload={handleDownloadPdf} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (user?.role === 'admin') return <div className="p-4 text-gpcet-text">Admins use the All Notes panel.</div>;

  return (
    <div className="flex flex-col h-auto min-h-full pb-6">

      {/* ── Main Tab Bar ───────────────────────────────────────── */}
      <div className="flex gap-1 px-4 pt-4 pb-0 shrink-0">
        <button
          onClick={() => setMainTab('my')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-black uppercase tracking-wider transition-all border-b-2 ${
            mainTab === 'my'
              ? 'text-gpcet-primary border-gpcet-primary bg-gpcet-card'
              : 'text-gpcet-muted border-transparent hover:text-gpcet-text hover:bg-white/5'
          }`}
        >
          <BookMarked size={15} />
          My Subjects
        </button>
        <button
          onClick={() => setMainTab('browse')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-black uppercase tracking-wider transition-all border-b-2 ${
            mainTab === 'browse'
              ? 'text-gpcet-primary border-gpcet-primary bg-gpcet-card'
              : 'text-gpcet-muted border-transparent hover:text-gpcet-text hover:bg-white/5'
          }`}
        >
          <Globe size={15} />
          Browse All
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════
           TAB 1 — MY SUBJECTS
         ════════════════════════════════════════════════════════ */}
      {mainTab === 'my' && (
        <div className="flex flex-col md:flex-row flex-1 gap-6 p-4 md:pt-4 md:p-4">
          {/* Left Panel */}
          <div className="w-full md:w-[280px] shrink-0 flex flex-col bg-gpcet-card rounded-3xl border border-gpcet-border overflow-hidden shadow-lg h-[250px] md:h-[calc(100vh-180px)]">
            <div className="p-5 border-b border-gpcet-border bg-gpcet-bg">
              <h2 className="text-xs uppercase font-black text-gpcet-muted tracking-widest">Your Subjects</h2>
            </div>
            <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
              {isLoadingSubjects ? (
                <div className="flex flex-col gap-2">
                  {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
                </div>
              ) : (
                <>
                  {subjects.regular.length > 0  && <div className="mb-4">{subjects.regular.map(s => renderSubjectButton(s, selectedSubject?.subject_code === s.subject_code, handleSelectSubject))}</div>}
                  {subjects.elective.length > 0  && <div className="mb-4">{subjects.elective.map(s => renderSubjectButton(s, selectedSubject?.subject_code === s.subject_code, handleSelectSubject))}</div>}
                  {subjects.lab.length > 0       && <div className="mb-4">{subjects.lab.map(s => renderSubjectButton(s, selectedSubject?.subject_code === s.subject_code, handleSelectSubject))}</div>}
                  {subjects.nptel.length > 0     && <div className="mb-4">{subjects.nptel.map(s => renderSubjectButton(s, selectedSubject?.subject_code === s.subject_code, handleSelectSubject))}</div>}
                </>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col min-w-0 h-[600px] md:h-[calc(100vh-180px)] md:mr-6">
            {renderNotesPanel(selectedSubject, filteredNotes, activeUnitTab, setActiveUnitTab, isLoadingNotes)}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
           TAB 2 — BROWSE ALL
         ════════════════════════════════════════════════════════ */}
      {mainTab === 'browse' && (
        <div className="flex flex-col flex-1 p-4 gap-4">

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <Info size={16} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-[12px] text-amber-300/90 font-medium leading-relaxed">
              <span className="font-black text-amber-300">📚 Browsing notes outside your current semester.</span>
              {' '}These notes are for reference only. Great for revision, previewing upcoming subjects, or cross-branch learning.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-gpcet-card rounded-2xl border border-gpcet-border p-4 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Branch */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gpcet-muted ml-1">Branch</label>
                <div className="relative">
                  <select
                    value={browseFilters.branch}
                    onChange={e => handleBrowseFilterChange('branch', e.target.value)}
                    className="w-full appearance-none bg-gpcet-bg border border-gpcet-border rounded-xl px-3 py-2.5 text-sm font-bold text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner pr-8"
                  >
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gpcet-muted pointer-events-none" />
                </div>
              </div>

              {/* Year */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gpcet-muted ml-1">Year</label>
                <div className="relative">
                  <select
                    value={browseFilters.year}
                    onChange={e => handleBrowseFilterChange('year', parseInt(e.target.value))}
                    className="w-full appearance-none bg-gpcet-bg border border-gpcet-border rounded-xl px-3 py-2.5 text-sm font-bold text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner pr-8"
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y === 1 ? '1st' : y === 2 ? '2nd' : y === 3 ? '3rd' : '4th'} Year</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gpcet-muted pointer-events-none" />
                </div>
              </div>

              {/* Semester */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gpcet-muted ml-1">Semester</label>
                <div className="relative">
                  <select
                    value={browseFilters.semester}
                    onChange={e => handleBrowseFilterChange('semester', parseInt(e.target.value))}
                    className="w-full appearance-none bg-gpcet-bg border border-gpcet-border rounded-xl px-3 py-2.5 text-sm font-bold text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner pr-8"
                  >
                    {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gpcet-muted pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Browse: Subject List + Notes Panel */}
          <div className="flex flex-col md:flex-row flex-1 gap-6 min-h-0">
            {/* Subject List */}
            <div className="w-full md:w-[280px] shrink-0 flex flex-col bg-gpcet-card rounded-3xl border border-gpcet-border overflow-hidden shadow-lg h-[220px] md:h-[calc(100vh-360px)]">
              <div className="p-5 border-b border-gpcet-border bg-gpcet-bg">
                <h2 className="text-xs uppercase font-black text-gpcet-muted tracking-widest">
                  {browseFilters.branch} · Y{browseFilters.year} · Sem {browseFilters.semester}
                </h2>
              </div>
              <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                {isLoadingBrowseSubjects ? (
                  <div className="flex flex-col gap-2">
                    {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                  </div>
                ) : browseSubjectList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                    <BookOpen size={28} className="text-gpcet-muted/40 mb-3" />
                    <p className="text-gpcet-muted text-xs font-bold">No subjects found</p>
                    <p className="text-gpcet-muted/60 text-[10px] mt-1">Try a different combination</p>
                  </div>
                ) : (
                  browseSubjectList.map(s => renderSubjectButton(
                    s,
                    browseSelectedSubject?.subject_code === s.subject_code,
                    handleBrowseSelectSubject
                  ))
                )}
              </div>
            </div>

            {/* Notes Panel */}
            <div className="flex-1 flex flex-col min-w-0 h-[500px] md:h-[calc(100vh-360px)] md:mr-6">
              {renderNotesPanel(
                browseSelectedSubject,
                filteredBrowseNotes,
                browseActiveUnitTab,
                setBrowseActiveUnitTab,
                isLoadingBrowseNotes
              )}
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      {viewingPdf && (
        <PDFViewer note={viewingPdf} onClose={() => setViewingPdf(null)} />
      )}
    </div>
  );
};

export default Notes;
