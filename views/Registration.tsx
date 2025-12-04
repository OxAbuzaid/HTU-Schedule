// src/views/Registration.tsx
import React, { useState, useEffect } from 'react';
import { Department, Course, Section, Language } from '../types';
import { storageService } from '../services/storage';
import { TRANSLATIONS } from '../constants';

interface Props {
  lang: Language;
}

export const Registration: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [depts, setDepts] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    university_id: '',
    major: '',
    advisor: ''
  });

  useEffect(() => {
    (async () => {
      const d = await storageService.getDepartments();
      setDepts(d);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedDept) {
        const c = await storageService.getCourses(selectedDept);
        setCourses(c);
        setSelectedCourse('');
        setSelectedSection('');
        setSections([]);
      } else {
        setCourses([]);
        setSelectedCourse('');
        setSections([]);
        setSelectedSection('');
      }
    })();
  }, [selectedDept]);

  useEffect(() => {
    (async () => {
      if (selectedCourse) {
        const s = await storageService.getSections(selectedCourse);
        setSections(s);
        setSelectedSection('');
      } else {
        setSections([]);
        setSelectedSection('');
      }
    })();
  }, [selectedCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return;
    setLoading(true);

    try {
      // First attempt to register
      const result = await storageService.registerStudent({
        ...formData,
        section_id: selectedSection
      });

      if (result.success) {
        alert(t.msg_success);
        setFormData({ name: '', university_id: '', major: '', advisor: '' });
        const updatedSections = await storageService.getSections(selectedCourse);
        setSections(updatedSections);
      } else if (result.full) {
        if (window.confirm(t.msg_full)) {
          await storageService.increaseCapacity(result.sectionId!);
          // Retry registration immediately
          const retryResult = await storageService.registerStudent({
            ...formData,
            section_id: selectedSection
          });

          if (retryResult.success) {
            alert(t.msg_success);
            setFormData({ name: '', university_id: '', major: '', advisor: '' });
            const updatedSections = await storageService.getSections(selectedCourse);
            setSections(updatedSections);
          } else {
            alert("Error: Could not register student even after increasing capacity. Please check system.");
          }
        }
      } else {
        alert('Failed to register student. See console for details.');
      }
    } catch (err) {
      console.error('handleSubmit error', err);
      alert('An unexpected error occurred. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">{t.reg_title}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dept & Course Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              required
            >
              <option value="">{t.ph_select_course}</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{lang === 'en' ? c.name_en : c.name_ar}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.lbl_section}</label>
          <select 
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedCourse}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
            required
          >
            <option value="">{t.ph_select_section}</option>
            {sections.map(s => (
              <option key={s.id} value={s.id}>
                #{s.section_number} ( {s.enrolled} / {s.capacity} )
              </option>
            ))}
          </select>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.lbl_name}</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.lbl_uid}</label>
              <input
                type="text"
                value={formData.university_id}
                onChange={e => setFormData({...formData, university_id: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.lbl_major}</label>
              <input
                type="text"
                value={formData.major}
                onChange={e => setFormData({...formData, major: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.lbl_advisor}</label>
              <input
                type="text"
                value={formData.advisor}
                onChange={e => setFormData({...formData, advisor: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow-sm"
        >
          {loading ? 'Please wait...' : t.btn_register}
        </button>
      </form>
    </div>
  );
};
