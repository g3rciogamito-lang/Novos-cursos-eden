import { PART1_TECH_COURSES } from './part1_tech';
import { PART2_BUSINESS_FINANCE_COURSES } from './part2_business_finance';
import { PART3_CREATIVE_LANG_COURSES } from './part3_creative_lang';
import { Course, LessonSummary, Module } from '../../types/university';

export const ALL_COURSES: Course[] = [
  ...PART1_TECH_COURSES,
  ...PART2_BUSINESS_FINANCE_COURSES,
  ...PART3_CREATIVE_LANG_COURSES,
].sort((a, b) => Number(a.number) - Number(b.number));

export function getCourseById(courseId: string): Course | undefined {
  return ALL_COURSES.find((c) => c.id === courseId || c.slug === courseId);
}

export function getCourseLessonCount(course: Course): number {
  return course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
}

export function getCourseLessonsFlat(course: Course): { module: Module; lesson: LessonSummary }[] {
  const flat: { module: Module; lesson: LessonSummary }[] = [];
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      flat.push({ module: mod, lesson });
    }
  }
  return flat;
}

export function getCourseModuleAndLesson(
  course: Course,
  lessonId?: string
): { module: Module; lesson: LessonSummary } {
  const flat = getCourseLessonsFlat(course);
  if (lessonId) {
    const found = flat.find((item) => item.lesson.id === lessonId);
    if (found) return found;
  }
  return flat[0];
}

export function getTotalPlatformMetrics() {
  const totalCourses = ALL_COURSES.length;
  const totalHours = ALL_COURSES.reduce((acc, c) => acc + c.totalHours, 0);
  const totalModules = ALL_COURSES.reduce((acc, c) => acc + c.modules.length, 0);
  const totalLessons = ALL_COURSES.reduce((acc, c) => acc + getCourseLessonCount(c), 0);
  return { totalCourses, totalHours, totalModules, totalLessons };
}
