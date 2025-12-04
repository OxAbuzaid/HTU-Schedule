
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

  const loadData = () => {
    const report = storageService.getSummary();
    setData(report);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExport = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      const allDepts = storageService.getDepartments();
      const allCourses = JSON.parse(localStorage.getItem('htu_courses') || '[]');
      const allSections = JSON.parse(localStorage.getItem('htu_sections') || '[]');
      const allStudents = JSON.parse(localStorage.getItem('htu_students') || '[]');

      allDepts.forEach(dept => {
        const deptCourses = allCourses.filter((c: any) => c.dept_id === dept.id);
        if (deptCourses.length === 0) return;

        // 1. Prepare Data Structure for Horizontal Layout
        let maxStudentRows = 0;
        
        const courseGrids = deptCourses.map((course: any) => {
          const sections = allSections
            .filter((s: any) => s.course_id === course.id)
            .sort((a: any, b: any) => a.section_number - b.section_number);
          
          if (sections.length === 0) return null;

          const sectionColumns = sections.map((s: any) => {
            return allStudents.filter((st: any) => st.section_id === s.id);
          });

          const courseMax = Math.max(...sectionColumns.map((col: any[]) => col.length));
          if (courseMax > maxStudentRows) maxStudentRows = courseMax;

          return {
            course,
            sections,
            sectionColumns
          };
        }).filter((g: any) => g !== null);

        if (courseGrids.length === 0) return;

        // 2. Build Grid
        const totalRows = 2 + maxStudentRows;
        const sheetData: any[][] = [];

        for(let r=0; r<totalRows; r++) {
          sheetData[r] = []; 
        }

        const merges: any[] = [];
        let currentCol = 0;

        // 3. Fill Grid
        courseGrids.forEach((grid: any) => {
          const { course, sections, sectionColumns } = grid;
          const sectionCount = sections.length;

          // A. Course Header
          sheetData[0][currentCol] = lang === 'en' ? course.name_en : course.name_ar;
          if (sectionCount > 1) {
            merges.push({
              s: { r: 0, c: currentCol },
              e: { r: 0, c: currentCol + sectionCount - 1 }
            });
          }

          // B. Section Headers & Data
          sections.forEach((s: any, idx: number) => {
            const actualCol = currentCol + idx;
            sheetData[1][actualCol] = lang === 'en' ? `Section ${s.section_number}` : `شعبة ${s.section_number}`;
            
            const students = sectionColumns[idx];
            students.forEach((student: any, sIdx: number) => {
              sheetData[2 + sIdx][actualCol] = `${student.university_id} | ${student.major}`;
            });
          });

          // Move Column Cursor (No Spacing)
          currentCol += sectionCount;
        });

        // 4. Create Sheet
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        if (merges.length > 0) ws['!merges'] = merges;

        const wscols = [];
        for(let i=0; i<currentCol; i++) wscols.push({ wch: 25 });
        ws['!cols'] = wscols;

        const sheetName = (lang === 'en' ? dept.name_en : dept.name_ar)
          .replace(/[\\/?*[\]]/g, "")
          .substring(0, 31);
          
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      XLSX.writeFile(wb, "HTU_Schedule_Final.xlsx");
    } catch (e) {
      console.error("Export failed", e);
      alert("Export failed. See console for details.");
    }
  };

  const filteredData = data.filter(item => {
    const term = searchTerm.toLowerCase();
    const courseNameEn = item.course_en ? item.course_en.toLowerCase() : '';
    const courseNameAr = item.course_ar ? item.course_ar.toLowerCase() : '';
    return courseNameEn.includes(term) || courseNameAr.includes(term);
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-slate-800">{t.sum_title}</h2>
        <div className="flex gap-2 items-center flex-1 justify-end">
           {/* Search Input */}
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
            {filteredData.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold text-gray-700">{lang === 'en' ? row.dept_en : row.dept_ar}</td>
                <td className="p-3 font-medium">{lang === 'en' ? row.course_en : row.course_ar}</td>
                <td className="p-3 text-center">{row.section}</td>
                <td className="p-3 text-center">{row.capacity}</td>
                <td className="p-3 text-center font-bold text-red-600">{row.enrolled}</td>
                <td className="p-3 text-gray-500 text-xs">
                  {row.students && row.students.length > 0 
                    ? row.students.map((s: any) => s.name).join(', ') 
                    : '-'}
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400 italic">No courses found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
