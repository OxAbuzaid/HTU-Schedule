
import { PreloadData } from './types';

export const INITIAL_DATA_STRUCTURE: PreloadData[] = [
  {
    dept: 'Computer Science',
    courses: [
      { name: 'Fundamental of computing', sections: 8 },
      { name: 'Software Development Lifecycles', sections: 3 },
      { name: 'Website Design & Development', sections: 4 },
      { name: 'ACA & Org', sections: 3 },
      { name: 'Computing Research Project', sections: 1 },
      { name: 'Application Development', sections: 2 },
      { name: 'Programming', sections: 12 },
      { name: 'Prototyping', sections: 6 },
      { name: 'Advanced Programming', sections: 6 },
      { name: 'Data Structures & Algorithms', sections: 4 },
      { name: 'Managing a Successful Computing Project', sections: 2 },
      { name: 'Planning a Computing Project', sections: 6 },
      { name: 'Business Intelligence', sections: 2 },
      { name: 'Business Process Support', sections: 7 },
      { name: 'Games Engine & Scripting', sections: 2 },
      { name: 'Systems Analysis & Design', sections: 4 },
      { name: 'ERP Systems', sections: 4 },
      { name: 'Operating Systems', sections: 4 },
      { name: 'Systems Programming', sections: 3 },
      { name: 'Database Programming', sections: 3 },
    ]
  },
  {
    dept: 'Cyber Security',
    courses: [
      { name: 'Security', sections: 6 },
      { name: 'Ethical Hacking', sections: 1 },
      { name: 'Cryptography', sections: 2 },
      { name: 'Networking', sections: 12 },
      { name: 'Network Security', sections: 2 },
      { name: 'Penetration Testing', sections: 2 },
      { name: 'Forensics', sections: 2 },
      { name: 'Information Security Management', sections: 1 },
      { name: 'Risk Analysis & Systems Testing', sections: 2 },
      { name: 'Secure Coding', sections: 1 },
    ]
  },
  {
    dept: 'Data Science & AI',
    courses: [
      { name: 'Database Design & Development', sections: 3 },
      { name: 'Principles of Data Science and Computing Systems', sections: 2 },
      { name: 'Data Science Programming', sections: 1 },
      { name: 'Machine Learning', sections: 2 },
      { name: 'Data Analytics', sections: 3 },
      { name: 'Artificial Intelligence & Intelligent Systems', sections: 4 },
      { name: 'Natural Language Processing', sections: 2 },
      { name: 'Data Visualization', sections: 2 },
      { name: 'Big Data Analytics and Visualization', sections: 2 },
      { name: 'Data Mining', sections: 2 },
      { name: 'Deep Learning', sections: 4 },
      { name: 'Modeling and Simulation', sections: 1 },
      { name: 'Optimization Theory', sections: 2 },
      { name: 'Applied Analytical Models', sections: 2 },
      { name: 'Game Design', sections: 2 },
      { name: 'Creative Games Development', sections: 2 },
      { name: 'Games Engine', sections: 2 },
      { name: 'Advanced Scripting for Games', sections: 2 },
      { name: 'Professional Practice', sections: 2 },
      { name: 'Math for Computing', sections: 2 },
      { name: 'Discrete Math', sections: 2 },
    ]
  },
  {
    dept: 'Common Courses',
    courses: [
      { name: 'IoT', sections: 2 },
      { name: 'Cloud Computing', sections: 2 },
      { name: 'Sys Admin', sections: 2 },
      { name: '.NET', sections: 1 },
      { name: 'React', sections: 1 },
      { name: 'Gen. AI', sections: 2 },
      { name: 'Block Chain', sections: 1 },
      { name: 'BioInformatics', sections: 1 },
    ]
  }
];

export const TRANSLATIONS = {
  en: {
    app_title: 'HTU Schedule',
    nav_register: 'Registration',
    nav_lookup: 'Student Lookup',
    nav_add_sections: 'Add Sections',
    nav_rebuild: 'Rebuild Sections',
    nav_summary: 'Summary & Export',
    
    // Departments
    dept_cs: 'Computer Science',
    dept_sec: 'Cyber Security',
    dept_ds: 'Data Science & AI',
    dept_common: 'Common Courses',

    // Registration
    reg_title: 'Student Course Registration',
    lbl_dept: 'Department',
    lbl_course: 'Course',
    lbl_section: 'Section',
    lbl_name: 'Student Name',
    lbl_uid: 'University ID',
    lbl_major: 'Major',
    lbl_advisor: 'Academic Advisor',
    btn_register: 'Register Student',
    msg_success: 'Student registered successfully!',
    msg_full: 'This section is full (Capacity reached).\n\nClick OK to increase capacity by 1 and register this student immediately.\nClick Cancel to abort.',
    ph_select_dept: 'Select a department',
    ph_select_course: 'Select a course',
    ph_select_section: 'Select a section',
    
    // Lookup
    lookup_title: 'Student Lookup',
    btn_search: 'Search',
    res_not_found: 'Student not found',
    col_course: 'Course',
    col_section: 'Section',
    col_time: 'Registered At',

    // Admin
    add_sec_title: 'Add New Sections',
    rebuild_title: 'Rebuild Sections (Reset)',
    lbl_num_sections: 'Total Sections to Create',
    lbl_add_count: 'Number of New Sections',
    btn_add: 'Add Sections',
    btn_rebuild: 'Rebuild Sections',
    msg_added: 'Sections added successfully!',
    msg_rebuilt: 'Sections rebuilt successfully!',
    warn_rebuild: 'WARNING: Rebuilding will DELETE all existing sections and registered students for this course. This cannot be undone.',

    // Summary
    sum_title: 'Course Summary',
    btn_export: 'Export to Excel',
    ph_search_course: 'Search course name...',
    col_dept: 'Department',
    col_cap: 'Capacity',
    col_enrolled: 'Enrolled',
    col_students: 'Student List',
  },
  ar: {
    app_title: 'جدول HTU',
    nav_register: 'تسجيل المواد',
    nav_lookup: 'بحث عن طالب',
    nav_add_sections: 'إضافة شعب',
    nav_rebuild: 'إعادة بناء الشعب',
    nav_summary: 'الملخص والتصدير',

    // Departments
    dept_cs: 'علم الحاسوب',
    dept_sec: 'الأمن السيبراني',
    dept_ds: 'علم البيانات والذكاء الاصطناعي',
    dept_common: 'مساقات مشتركة',

    // Registration
    reg_title: 'تسجيل مساقات الطلبة',
    lbl_dept: 'القسم',
    lbl_course: 'المساق',
    lbl_section: 'الشعبة',
    lbl_name: 'اسم الطالب',
    lbl_uid: 'الرقم الجامعي',
    lbl_major: 'التخصص',
    lbl_advisor: 'المرشد الأكاديمي',
    btn_register: 'تسجيل الطالب',
    msg_success: 'تم تسجيل الطالب بنجاح!',
    msg_full: 'هذه الشعبة ممتلئة.\n\nاضغط "موافق" لزيادة السعة بمقدار 1 وتسجيل الطالب فوراً.\nاضغط "إلغاء" للتراجع.',
    ph_select_dept: 'اختر القسم',
    ph_select_course: 'اختر المساق',
    ph_select_section: 'اختر الشعبة',

    // Lookup
    lookup_title: 'البحث عن طالب',
    btn_search: 'بحث',
    res_not_found: 'لم يتم العثور على الطالب',
    col_course: 'المساق',
    col_section: 'الشعبة',
    col_time: 'وقت التسجيل',

    // Admin
    add_sec_title: 'إضافة شعب جديدة',
    rebuild_title: 'إعادة بناء الشعب (تهيئة)',
    lbl_num_sections: 'إجمالي عدد الشعب',
    lbl_add_count: 'عدد الشعب الجديدة',
    btn_add: 'إضافة شعب',
    btn_rebuild: 'إعادة بناء الشعب',
    msg_added: 'تم إضافة الشعب بنجاح!',
    msg_rebuilt: 'تم إعادة بناء الشعب بنجاح!',
    warn_rebuild: 'تحذير: إعادة البناء ستقوم بحذف جميع الشعب الحالية والطلاب المسجلين في هذا المساق. لا يمكن التراجع عن هذا الإجراء.',

    // Summary
    sum_title: 'ملخص المساقات',
    btn_export: 'تصدير إلى Excel',
    ph_search_course: 'بحث عن اسم مساق...',
    col_dept: 'القسم',
    col_cap: 'السعة',
    col_enrolled: 'المسجلين',
    col_students: 'قائمة الطلبة',
  }
};