// src/services/storage.ts
import { v4 as uuidv4 } from 'uuid';
import { INITIAL_DATA_STRUCTURE, TRANSLATIONS } from '../constants';
import { Department, Course, Section, Student } from '../types';
import { supabase } from '../lib/supabase';

const mapDeptName = (name: string): string => {
  if (name === 'Computer Science') return TRANSLATIONS.ar.dept_cs;
  if (name === 'Cyber Security') return TRANSLATIONS.ar.dept_sec;
  if (name === 'Data Science & AI') return TRANSLATIONS.ar.dept_ds;
  return TRANSLATIONS.ar.dept_common;
};

export const storageService = {
  // Seed initial data (only if no departments exist)
  initialize: async (): Promise<void> => {
    try {
      const { data: existing, error: existErr } = await supabase.from('departments').select('id').limit(1);
      if (existErr) {
        console.error('Failed to check departments:', existErr);
        return;
      }
      if (existing && existing.length > 0) return; // already initialized

      // Insert departments, courses, sections
      for (const d of INITIAL_DATA_STRUCTURE) {
        const { data: deptData, error: deptErr } = await supabase
          .from('departments')
          .insert([{ name_en: d.dept, name_ar: mapDeptName(d.dept) }])
          .select();
        if (deptErr) {
          console.error('Insert department error', deptErr);
          continue;
        }
        const deptId = (deptData as any)[0].id;

        for (const c of d.courses) {
          const { data: courseData, error: courseErr } = await supabase
            .from('courses')
            .insert([{ dept_id: deptId, name_en: c.name, name_ar: c.name }])
            .select();
          if (courseErr) {
            console.error('Insert course error', courseErr);
            continue;
          }
          const courseId = (courseData as any)[0].id;

          const sectionsToInsert = Array.from({ length: c.sections }, (_, i) => ({
            course_id: courseId,
            section_number: i + 1,
            capacity: 20,
            enrolled: 0
          }));
          if (sectionsToInsert.length > 0) {
            const { error: secErr } = await supabase.from('sections').insert(sectionsToInsert);
            if (secErr) console.error('Insert sections error', secErr);
          }
        }
      }
    } catch (e) {
      console.error('Initialize failed', e);
    }
  },

  // Read helpers
  getDepartments: async (): Promise<Department[]> => {
    const { data, error } = await supabase.from('departments').select('*').order('name_en');
    if (error) { console.error('getDepartments', error); return []; }
    return (data || []) as Department[];
  },

  getCourses: async (deptId: string): Promise<Course[]> => {
    const { data, error } = await supabase.from('courses').select('*').eq('dept_id', deptId).order('name_en');
    if (error) { console.error('getCourses', error); return []; }
    return (data || []) as Course[];
  },

  getSections: async (courseId: string): Promise<Section[]> => {
    const { data, error } = await supabase.from('sections').select('*').eq('course_id', courseId).order('section_number');
    if (error) { console.error('getSections', error); return []; }
    return (data || []) as Section[];
  },

  // Register a student (non-transactional; see notes)
  registerStudent: async (studentData: Omit<Student, 'id' | 'created_at'>): Promise<{ success: boolean; full?: boolean; sectionId?: string }> => {
    try {
      const { data: section, error: secErr } = await supabase.from('sections').select('*').eq('id', studentData.section_id).limit(1).single();
      if (secErr || !section) {
        console.error('registerStudent: failed to fetch section', secErr);
        return { success: false };
      }

      const currentEnrolled = Number((section as any).enrolled) || 0;
      const currentCapacity = Number((section as any).capacity) || 0;

      if (currentEnrolled >= currentCapacity) {
        return { success: false, full: true, sectionId: (section as any).id };
      }

      // increment enrolled (best-effort; not fully transactional)
      const { error: updErr } = await supabase.from('sections').update({ enrolled: currentEnrolled + 1 }).eq('id', (section as any).id);
      if (updErr) {
        console.error('registerStudent: failed to increment enrolled', updErr);
        return { success: false };
      }

      // insert student
      const { error: insErr } = await supabase.from('students').insert([{
        section_id: studentData.section_id,
        name: studentData.name,
        university_id: studentData.university_id,
        major: studentData.major,
        advisor: studentData.advisor
      }]);
      if (insErr) {
        console.error('registerStudent: failed to insert student', insErr);
        // rollback attempt (best-effort)
        await supabase.from('sections').update({ enrolled: currentEnrolled }).eq('id', (section as any).id);
        return { success: false };
      }

      return { success: true };
    } catch (e) {
      console.error('registerStudent exception', e);
      return { success: false };
    }
  },

  increaseCapacity: async (sectionId: string): Promise<void> => {
    try {
      const { data, error } = await supabase.from('sections').select('capacity').eq('id', sectionId).limit(1).single();
      if (error || !data) { console.error('increaseCapacity: fetch error', error); return; }
      const current = Number((data as any).capacity) || 0;
      await supabase.from('sections').update({ capacity: current + 1 }).eq('id', sectionId);
    } catch (e) {
      console.error('increaseCapacity exception', e);
    }
  },

  findStudent: async (universityId: string): Promise<{ student: Student; details: { courseName: string; sectionNum: number }[] } | null> => {
    try {
      const { data: students, error: stErr } = await supabase.from('students').select('*').eq('university_id', universityId);
      if (stErr) { console.error('findStudent', stErr); return null; }
      if (!students || students.length === 0) return null;

      const baseInfo = students[0] as Student;

      const details = await Promise.all(students.map(async (s: any) => {
        const { data: secData, error: secErr } = await supabase.from('sections').select('*').eq('id', s.section_id).limit(1).single();
        if (secErr || !secData) return { courseName: 'Unknown', sectionNum: 0 };
        const sec = secData as Section;
        const { data: courseData, error: courseErr } = await supabase.from('courses').select('*').eq('id', sec.course_id).limit(1).single();
        if (courseErr || !courseData) return { courseName: 'Unknown', sectionNum: sec.section_number };
        const course = (Array.isArray(courseData) ? courseData[0] : courseData) as Course;
        return { courseName: course.name_en, sectionNum: sec.section_number };
      }));

      return { student: baseInfo, details };
    } catch (e) {
      console.error('findStudent exception', e);
      return null;
    }
  },

  addSections: async (courseId: string, count: number): Promise<void> => {
    if (count < 1 || isNaN(count)) return;
    try {
      const { data: existing } = await supabase.from('sections').select('section_number').eq('course_id', courseId);
      let maxNum = 0;
      if (existing && existing.length > 0) {
        maxNum = existing.reduce((m: number, s: any) => Math.max(m, s.section_number || 0), 0);
      }
      const newSecs = Array.from({ length: count }, (_, i) => ({
        course_id: courseId,
        section_number: maxNum + i + 1,
        capacity: 20,
        enrolled: 0
      }));
      const { error } = await supabase.from('sections').insert(newSecs);
      if (error) console.error('addSections error', error);
    } catch (e) {
      console.error('addSections exception', e);
    }
  },

  rebuildSections: async (courseId: string, count: number): Promise<boolean> => {
    if (count < 1 || isNaN(count)) return false;
    try {
      // Find existing section IDs for the course
      const { data: sectionsToRemove, error: sErr } = await supabase.from('sections').select('id').eq('course_id', courseId);
      if (sErr) { console.error('rebuildSections fetch error', sErr); return false; }
      const ids = (sectionsToRemove || []).map((s: any) => s.id);

      if (ids.length > 0) {
        const { error: delErr } = await supabase.from('sections').delete().in('id', ids);
        if (delErr) console.error('rebuildSections delete error', delErr);
      }

      // Insert new sections
      const newSecs = Array.from({ length: count }, (_, i) => ({
        course_id: courseId,
        section_number: i + 1,
        capacity: 20,
        enrolled: 0
      }));
      const { error: insErr } = await supabase.from('sections').insert(newSecs);
      if (insErr) { console.error('rebuildSections insert error', insErr); return false; }

      // Students in deleted sections removed by cascade (if FK ON DELETE CASCADE configured)
      return true;
    } catch (e) {
      console.error('rebuildSections exception', e);
      return false;
    }
  },

  getSummary: async (): Promise<any[]> => {
    try {
      const { data: depts } = await supabase.from('departments').select('*').order('name_en');
      const { data: courses } = await supabase.from('courses').select('*');
      const { data: sections } = await supabase.from('sections').select('*');
      const { data: students } = await supabase.from('students').select('*');

      const report: any[] = [];

      (depts || []).forEach((dept: any) => {
        const deptCourses = (courses || []).filter((c: any) => c.dept_id === dept.id);
        deptCourses.forEach((course: any) => {
          const courseSections = (sections || [])
            .filter((s: any) => s.course_id === course.id)
            .sort((a: any, b: any) => a.section_number - b.section_number);

          courseSections.forEach((sec: any) => {
            const enrolledStudents = (students || []).filter((s: any) => s.section_id === sec.id);
            report.push({
              id: sec.id,
              dept_en: dept.name_en,
              dept_ar: dept.name_ar,
              course_en: course.name_en,
              course_ar: course.name_ar,
              section: sec.section_number,
              capacity: sec.capacity,
              enrolled: sec.enrolled,
              students: enrolledStudents
            });
          });
        });
      });

      return report;
    } catch (e) {
      console.error('getSummary exception', e);
      return [];
    }
  }
};
