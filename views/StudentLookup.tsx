import React, { useState } from 'react';
import { Language, Student } from '../types';
import { storageService } from '../services/storage';
import { TRANSLATIONS } from '../constants';
import { Search } from 'lucide-react';

interface Props {
  lang: Language;
}

export const StudentLookup: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<{ student: Student, details: { courseName: string, sectionNum: number }[] } | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const res = storageService.findStudent(searchId);
    setResult(res);
    setSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">{t.lookup_title}</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder={t.lbl_uid}
            className="flex-1 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-red-500"
            required
          />
          <button 
            type="submit" 
            className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 flex items-center gap-2"
          >
            <Search size={18} />
            {t.btn_search}
          </button>
        </form>
      </div>

      {searched && !result && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          {t.res_not_found}
        </div>
      )}

      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b pb-4">
            <div>
              <span className="block text-xs text-gray-500 uppercase">{t.lbl_name}</span>
              <span className="text-lg font-medium">{result.student.name}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 uppercase">{t.lbl_uid}</span>
              <span className="text-lg font-medium">{result.student.university_id}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 uppercase">{t.lbl_major}</span>
              <span className="text-lg font-medium">{result.student.major}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 uppercase">{t.lbl_advisor}</span>
              <span className="text-lg font-medium">{result.student.advisor}</span>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-3">{t.col_course}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-sm font-semibold">{t.col_course}</th>
                  <th className="p-3 text-sm font-semibold">{t.col_section}</th>
                  <th className="p-3 text-sm font-semibold">{t.col_time}</th>
                </tr>
              </thead>
              <tbody>
                {result.details.map((detail, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="p-3">{detail.courseName}</td>
                    <td className="p-3 text-center">{detail.sectionNum}</td>
                    <td className="p-3 text-gray-500 text-sm">
                      {new Date(result.student.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};