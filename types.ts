export type Language = 'en' | 'ar';

export interface Department {
  id: string;
  name_en: string;
  name_ar: string;
}

export interface Course {
  id: string;
  dept_id: string;
  name_en: string;
  name_ar: string;
}

export interface Section {
  id: string;
  course_id: string;
  section_number: number;
  capacity: number;
  enrolled: number;
}

export interface Student {
  id: string;
  name: string;
  university_id: string;
  major: string;
  advisor: string;
  section_id: string;
  created_at: string;
}

export type ViewState = 'registration' | 'lookup' | 'add-sections' | 'rebuild-sections' | 'summary';

export interface PreloadData {
  dept: string;
  courses: { name: string; sections: number }[];
}