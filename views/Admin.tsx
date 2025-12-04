// src/views/Admin.tsx
import React, { useState, useEffect } from 'react';
import { Department, Course, Language } from '../types';
import { storageService } from '../services/storage';
import { TRANSLATIONS } from '../constants';

interface Props {
  lang: Language;
  mode: 'add' | 'rebuild';
}

export const Admin: React.FC<Props> = ({ lang, mode }) => {
  const t = TRANSLATIONS[lang];
  const [depts, setDepts] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [numberInput, setNumberInput] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const d = await storageService.getDepartments();
      setDepts(d);
    })();
  }, []);

  useEffect(() => {
    // Reset selection when switching modes
    setSelectedDept('');
    setSelectedCourse('');
    setNumberInput(1);
    setCourses([]);
  }, [mode]);

  useEffect(() => {
    (async () => {
      if (selectedDept) {
        const c = await storageService.getCourses(selectedDept);
        setCourses(c);
        setSelectedCourse('');
      } else {
        setCourses([]);
        setSelectedCourse('');
      }
    })();
  }, [selectedDept]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || numberInput < 1) return;

    setLoading(true);
    try {
      if (mode === 'rebuild') {
        const success = await storageService.rebuildSections(selectedCourse, numberInput);
        if (success) {
          alert(t.msg_rebuilt);
          // Force reload to ensure all states pick up fresh schema
          window.location.reload();
        } else {
          alert("Failed to rebuild sections.");
        }
      } else {
        await storageService.addSections(selectedCourse, numberInput);
        alert(t.msg_added);
        setNumberInput(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const isRebuild = mode === 'rebuild';

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto border-t-4 ${isRebuild ? 'border-red-500' : 'border-green-500'}`}>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        {isRebuild ? t.rebuild_title : t.add_sec_title}
      </h2>
      
      {isRebuild && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border border-red-100">
          {t.warn_rebuild}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.lbl_dept}</label>
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">{t.ph_select_dept}</option>
            {depts.map(d => (
              <option key={d.id} value={d.id}>{lang === 'en' ? d.name_en : d.name_ar}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.lbl_course}</label>
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            disabled={!selectedDept}
            className="w-full p-2 border border-slate-300 rounded disabled:bg-gray-100 focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">{t.ph_select_course}</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{lang === 'en' ? c.name_en : c.name_ar}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {isRebuild ? t.lbl_num_sections : t.lbl_add_count}
          </label>
          <input
            type="number"
            min="1"
            value={numberInput}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setNumberInput(isNaN(val) ? 0 : val);
            }}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={!selectedCourse || numberInput < 1 || loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition shadow-sm ${
            (!selectedCourse || numberInput < 1 || loading)
              ? 'bg-gray-400 cursor-not-allowed' 
              : isRebuild ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Please wait...' : (isRebuild ? t.btn_rebuild : t.btn_add)}
        </button>
      </form>
    </div>
  );
};
