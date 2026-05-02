import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Settings2, ChevronDown, Save, X,
  BookOpen, ShieldCheck, Hash, Layers, Loader2, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(user?.year || 1);
  const [selectedSemester, setSelectedSemester] = useState(user?.semester || 1);
  const [submitting, setSubmitting] = useState(false);

  const openModal = () => {
    setSelectedYear(user?.year || 1);
    setSelectedSemester(user?.semester || 1);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleUpdate = async () => {
    if (selectedYear === user?.year && selectedSemester === user?.semester) {
      toast('No changes made.', { icon: '💡' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.patch('/auth/update-semester', {
        year: selectedYear,
        semester: selectedSemester
      });

      updateUser(res.data.user, res.data.accessToken);
      setModalOpen(false);
      toast.success(`Updated to Year ${selectedYear} Semester ${selectedSemester} successfully!`);
      navigate('/dashboard');
    } catch (err) {
      // Error toast handled by api.js interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const chips = [
    { label: 'Branch', value: user?.branch, icon: <BookOpen size={13} />, locked: true },
    { label: 'Year', value: user?.year, icon: <GraduationCap size={13} />, locked: false },
    { label: 'Semester', value: user?.semester, icon: <Layers size={13} />, locked: false },
    { label: 'Regulation', value: user?.regulation, icon: <Hash size={13} />, locked: true }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gpcet-primary/10 rounded-2xl border border-gpcet-primary/20 text-gpcet-primary">
            <Settings2 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gpcet-text">Settings</h1>
            <p className="text-gpcet-muted text-sm font-medium mt-0.5">Manage your account preferences</p>
          </div>
        </div>
      </div>

      {/* Academic Year Section */}
      <div className="bg-gpcet-card rounded-3xl border border-gpcet-border shadow-xl overflow-hidden mb-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 px-8 py-5 border-b border-gpcet-border bg-gpcet-bg/50">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <GraduationCap size={18} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gpcet-text">Academic Year</h2>
            <p className="text-gpcet-muted text-[11px] font-medium">Your current academic enrollment details</p>
          </div>
        </div>

        <div className="px-8 py-7">
          {/* Read-Only Chips */}
          <div className="flex flex-wrap gap-3 mb-8">
            {chips.map(chip => (
              <div
                key={chip.label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gpcet-bg border border-gpcet-border shadow-inner group"
              >
                <span className="text-gpcet-muted">{chip.icon}</span>
                <span className="text-[11px] font-black uppercase tracking-wider text-gpcet-muted">{chip.label}:</span>
                <span className="text-sm font-black text-gpcet-text">{chip.value}</span>
                {chip.locked && (
                  <Lock size={10} className="text-gpcet-muted/50 ml-1" title="Permanent — contact admin to change" />
                )}
              </div>
            ))}
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-3 mb-7 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
            <ShieldCheck size={16} className="text-blue-400 mt-0.5 shrink-0" />
            <p className="text-[12px] text-blue-300/80 font-medium leading-relaxed">
              <span className="font-black text-blue-300">Branch</span> and <span className="font-black text-blue-300">Regulation</span> are permanent and can only be changed by an admin.
              You may update your <span className="font-black text-blue-300">Year</span> and <span className="font-black text-blue-300">Semester</span> when you move to the next semester.
            </p>
          </div>

          {/* Update Button */}
          <button
            onClick={openModal}
            className="flex items-center gap-2.5 px-6 py-3 bg-gpcet-primary hover:bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Layers size={16} />
            Update Semester
          </button>
        </div>
      </div>

      {/* Update Semester Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-sm bg-gpcet-card border border-gpcet-border rounded-3xl shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-gpcet-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gpcet-primary/10 rounded-xl border border-gpcet-primary/20 text-gpcet-primary">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="font-black text-gpcet-text text-lg">Update Semester</h3>
                  <p className="text-gpcet-muted text-[11px] font-medium">Select your new year and semester</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                disabled={submitting}
                className="p-2 rounded-xl text-gpcet-muted hover:text-gpcet-text hover:bg-white/5 transition-all disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-7 py-6 space-y-5">
              {/* Year Dropdown */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1">Year</label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(parseInt(e.target.value))}
                    className="w-full appearance-none bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-3 text-sm font-bold text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner cursor-pointer pr-10"
                  >
                    {[1, 2, 3, 4].map(y => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gpcet-muted pointer-events-none" />
                </div>
              </div>

              {/* Semester Dropdown */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gpcet-muted ml-1">Semester</label>
                <div className="relative">
                  <select
                    value={selectedSemester}
                    onChange={e => setSelectedSemester(parseInt(e.target.value))}
                    className="w-full appearance-none bg-gpcet-bg border border-gpcet-border rounded-xl px-4 py-3 text-sm font-bold text-gpcet-text focus:ring-2 focus:ring-gpcet-primary outline-none shadow-inner cursor-pointer pr-10"
                  >
                    {[1, 2].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gpcet-muted pointer-events-none" />
                </div>
              </div>

              {/* Preview chip if changed */}
              {(selectedYear !== user?.year || selectedSemester !== user?.semester) && (
                <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/10 rounded-2xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  <p className="text-[11px] text-green-400 font-bold">
                    Will switch from Y{user?.year}S{user?.semester} → Y{selectedYear}S{selectedSemester}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-7 pb-7">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl border border-gpcet-border text-gpcet-muted font-bold text-sm hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-gpcet-primary hover:bg-blue-600 text-white font-black text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Save size={16} />
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
