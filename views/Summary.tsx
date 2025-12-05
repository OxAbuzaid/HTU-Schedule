import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { storageService } from '../services/storage';
import { TRANSLATIONS } from '../constants';
import { Download, RefreshCw, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Props {
  lang: Language;
}

export const Summary: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const safeParse = (key: string) => {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  };

  const loadData = () => {
    const summary = storageService.getSummary() || [];
    setData(summary);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExport = () => {
    try {
      const wb = XLSX.utils.book_new();

      const allDepts = storageService.getDepartments() || [];
      const allCourses = safeParse('courses');
      const allSections = safeParse('sections');
      const allStudents = safeParse('students');

      allDepts.forEach((dept) => {
        const deptCourses = allCourses.filter((c: any) => c.dept_id === dept.id);
        if (deptCourses.length === 0) return;

        let maxRows = 0;

        const grids = deptCourses
          .map((course) => {
            const sections = allSections
              .filter((s: any) => s.course_id === course.id)
              .sort((a: any, b: any) => a.section_number - b.section_number);

            if (sections.length === 0) return null;

            const columns = sections.map((sec: any) =>
              allStudents.filter((st: any) => st.section_id === sec.id)
            );

            const max = Math.max(...columns.map((col) => col.length));
            if (max > maxRows) maxRows = max;

            return { course, sections, columns };
          })
          .filter(Boolean);

        if (grids.length === 0) return;

        const rows = 2 + maxRows;
        const sheet: any[][] = Array.from({ length: rows }, () => []);
        const merges: any[] = [];

        let col = 0;

        grids.forEach((g: any) => {
          const { course, sections, columns } = g;

          sheet[0][col] = lang === 'en' ? course.name_en : course.name_ar;

          if (sections.length > 1) {
            merges.push({
              s: { r: 0, c: col },
              e: { r: 0, c: col + sections.length - 1 },
            });
          }

          sections.forEach((sec: any, idx: number) => {
            const realCol = col + idx;

            sheet[1][realCol] =
              lang === 'en'
                ? `Section ${sec.section_number}`
                : `شعبة ${sec.section_number}`;

            const students = columns[idx];
            students.forEach((s: any, r: number) => {
              sheet[2 + r][realCol] = `${s.university_id} | ${s.major}`;
            });
          });

          col += sections.length;
        });

        const ws = XLSX.utils.aoa_to_sheet(sheet);
        if (merges.length > 0) ws['!merges'] = merges;

        ws['!cols'] = Array(col).fill({ wch: 25 });

        const sheetName = (lang === 'en' ? dept.name_en : dept.name_ar)
          .replace(/[\\/?*[\]]/g, '')
          .substring(0, 31);

        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      XLSX.writeFile(wb, 'HTU_Schedule_Final.xlsx');
    } catch (err) {
      console.error(err);
      alert('Export failed');
    }
  };

  const filtered = data.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      (item.course_en || '').toLowerCase().includes(q) ||
      (item.course_ar || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-slate-800">{t.sum_title}</h2>

        <div className="flex gap-2 items-center flex-1 justify-end">
          <div className="relative max-w-xs w-full mr-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.ph_search_course}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <button
            onClick={loadData}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-200"
          >
            <RefreshCw size={18} />
          </button>

          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 shadow-sm"
          >
            <Download size={18} />
            {t.btn_export}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-slate-600 border-b-2 border-red-100">
              <th className="p-3 text-red-800">{t.col_dept}</th>
              <th className="p-3 text-red-800">{t.col_course}</th>
              <th className="p-3 text-red-800">#</th>
              <th className="p-3 text-red-800">{t.col_cap}</th>
              <th className="p-3 text-red-800">{t.col_enrolled}</th>
              <th className="p-3 w-1/3 text-red-800">{t.col_students}</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filtered.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold text-gray-700">
                  {lang === 'en' ? row.dept_en : row.dept_ar}
                </td>
                <td className="p-3 font-medium">
                  {lang === 'en' ? row.course_en : row.course_ar}
                </td>
                <td className="p-3 text-center">{row.section}</td>
                <td className="p-3 text-center">{row.capacity}</td>
                <td className="p-3 text-center font-bold text-red-600">
                  {row.enrolled}
                </td>
                <td className="p-3 text-gray-500 text-xs">
                  {row.students?.length
                    ? row.students.map((s: any) => s.name).join(', ')
                    : '-'}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400 italic">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
