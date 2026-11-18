import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ALL_COURSES, getCourseLessonCount } from '../data/courses';
import { createInitialStudentState, universityRepository } from '../services/repository';
import {
  AppView,
  ApprovalCriteria,
  Assessment,
  Certificate,
  Course,
  CourseProject,
  ExerciseAttemptRecord,
  ProjectSubmissionRecord,
  StudentState,
  StudentUser,
} from '../types/university';

export interface CourseDiagnostics {
  enrolled: boolean;
  totalLessons: number;
  completedLessons: number;
  completionPct: number;
  exercisesAttempted: number;
  exercisesCorrect: number;
  averageScore: number;
  finalExamPassed: boolean;
  intermediateExamPassed: boolean;
  finalProjectSubmitted: boolean;
  studyHours: number;
  eligibleForCertificate: boolean;
  certificate?: Certificate;
}

interface UniversityContextValue {
  state: StudentState;
  loading: boolean;
  view: AppView;
  navigate: (next: AppView) => void;
  enrollInCourse: (courseId: string) => void;
  markLessonCompleted: (courseId: string, lessonId: string, minutesSpent?: number) => void;
  setLastLesson: (courseId: string, lessonId: string) => void;
  toggleFavoriteLesson: (lessonId: string) => void;
  saveLessonNote: (courseId: string, lessonId: string, content: string) => void;
  recordExerciseAttempt: (attempt: Omit<ExerciseAttemptRecord, 'attemptedAt'>) => void;
  recordAssessmentResult: (assessment: Assessment, score: number) => void;
  submitProject: (project: CourseProject, submissionText: string, artifactUrlOrNotes: string) => void;
  updateProfile: (updates: Partial<StudentUser>) => void;
  updateApprovalCriteria: (criteria: ApprovalCriteria) => void;
  setReaderFontSize: (size: number) => void;
  setComfortableReadingMode: (enabled: boolean) => void;
  requestCertificate: (course: Course) => Promise<{ certificate?: Certificate; error?: string }>;
  getCourseDiagnostics: (course: Course) => CourseDiagnostics;
  logStudyMinutes: (courseId: string, minutes: number) => void;
}

const UniversityContext = createContext<UniversityContextValue | null>(null);

export const UniversityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StudentState>(createInitialStudentState);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<AppView>({ page: 'home' });

  useEffect(() => {
    let active = true;
    universityRepository.loadStudentState().then((loaded) => {
      if (active) {
        setState(loaded);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback((updater: (prev: StudentState) => StudentState) => {
    setState((prev) => {
      const next = updater(prev);
      void universityRepository.saveStudentState(next);
      return next;
    });
  }, []);

  const navigate = useCallback((next: AppView) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const enrollInCourse = useCallback(
    (courseId: string) => {
      persist((prev) => {
        if (prev.enrolledCourseIds.includes(courseId)) return prev;
        return {
          ...prev,
          enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
        };
      });
    },
    [persist]
  );

  const logStudyMinutes = useCallback(
    (courseId: string, minutes: number) => {
      if (minutes <= 0) return;
      persist((prev) => {
        const dayIndex = (new Date().getDay() + 6) % 7; // Mon=0..Sun=6
        const updatedDaily = prev.dailyStudyMinutes.map((entry, idx) =>
          idx === dayIndex ? { ...entry, minutes: entry.minutes + minutes } : entry
        );
        return {
          ...prev,
          studyMinutesByCourse: {
            ...prev.studyMinutesByCourse,
            [courseId]: (prev.studyMinutesByCourse[courseId] || 0) + minutes,
          },
          dailyStudyMinutes: updatedDaily,
        };
      });
    },
    [persist]
  );

  const markLessonCompleted = useCallback(
    (courseId: string, lessonId: string, minutesSpent = 20) => {
      persist((prev) => {
        const already = prev.completedLessonIds.includes(lessonId);
        const enrolled = prev.enrolledCourseIds.includes(courseId)
          ? prev.enrolledCourseIds
          : [...prev.enrolledCourseIds, courseId];
        const dayIndex = (new Date().getDay() + 6) % 7;
        const updatedDaily = already
          ? prev.dailyStudyMinutes
          : prev.dailyStudyMinutes.map((entry, idx) =>
              idx === dayIndex ? { ...entry, minutes: entry.minutes + minutesSpent } : entry
            );
        return {
          ...prev,
          enrolledCourseIds: enrolled,
          completedLessonIds: already ? prev.completedLessonIds : [...prev.completedLessonIds, lessonId],
          lastLessonByCourse: { ...prev.lastLessonByCourse, [courseId]: lessonId },
          studyMinutesByCourse: already
            ? prev.studyMinutesByCourse
            : {
                ...prev.studyMinutesByCourse,
                [courseId]: (prev.studyMinutesByCourse[courseId] || 0) + minutesSpent,
              },
          dailyStudyMinutes: updatedDaily,
        };
      });
    },
    [persist]
  );

  const setLastLesson = useCallback(
    (courseId: string, lessonId: string) => {
      persist((prev) => ({
        ...prev,
        enrolledCourseIds: prev.enrolledCourseIds.includes(courseId)
          ? prev.enrolledCourseIds
          : [...prev.enrolledCourseIds, courseId],
        lastLessonByCourse: { ...prev.lastLessonByCourse, [courseId]: lessonId },
      }));
    },
    [persist]
  );

  const toggleFavoriteLesson = useCallback(
    (lessonId: string) => {
      persist((prev) => {
        const exists = prev.favoriteLessonIds.includes(lessonId);
        return {
          ...prev,
          favoriteLessonIds: exists
            ? prev.favoriteLessonIds.filter((id) => id !== lessonId)
            : [...prev.favoriteLessonIds, lessonId],
        };
      });
    },
    [persist]
  );

  const saveLessonNote = useCallback(
    (courseId: string, lessonId: string, content: string) => {
      persist((prev) => ({
        ...prev,
        notesByLesson: {
          ...prev.notesByLesson,
          [lessonId]: {
            lessonId,
            courseId,
            content,
            updatedAt: new Date().toISOString(),
          },
        },
      }));
    },
    [persist]
  );

  const recordExerciseAttempt = useCallback(
    (attempt: Omit<ExerciseAttemptRecord, 'attemptedAt'>) => {
      persist((prev) => ({
        ...prev,
        exerciseAttempts: {
          ...prev.exerciseAttempts,
          [attempt.exerciseId]: {
            ...attempt,
            attemptedAt: new Date().toISOString(),
          },
        },
      }));
    },
    [persist]
  );

  const recordAssessmentResult = useCallback(
    (assessment: Assessment, score: number) => {
      const passed = score >= assessment.passingScore;
      persist((prev) => ({
        ...prev,
        assessmentResults: {
          ...prev.assessmentResults,
          [assessment.id]: {
            assessmentId: assessment.id,
            courseId: assessment.courseId,
            kind: assessment.kind,
            score,
            passed,
            completedAt: new Date().toISOString(),
          },
        },
      }));
    },
    [persist]
  );

  const submitProject = useCallback(
    (project: CourseProject, submissionText: string, artifactUrlOrNotes: string) => {
      const record: ProjectSubmissionRecord = {
        projectId: project.id,
        courseId: project.courseId,
        title: project.title,
        submissionText,
        artifactUrlOrNotes,
        selfChecklistCompleted: true,
        score: Math.min(100, Math.max(75, Math.round(72 + Math.min(28, submissionText.trim().length / 18)))),
        status: 'Avaliado',
        submittedAt: new Date().toISOString(),
      };
      persist((prev) => ({
        ...prev,
        projectSubmissions: {
          ...prev.projectSubmissions,
          [project.id]: record,
        },
      }));
    },
    [persist]
  );

  const updateProfile = useCallback(
    (updates: Partial<StudentUser>) => {
      persist((prev) => {
        const merged = { ...prev.user, ...updates };
        const parts = merged.name.trim().split(/\s+/);
        merged.avatarInitials =
          parts.length >= 2
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            : merged.name.slice(0, 2).toUpperCase() || 'IM';
        return { ...prev, user: merged };
      });
    },
    [persist]
  );

  const updateApprovalCriteria = useCallback(
    (approvalCriteria: ApprovalCriteria) => {
      persist((prev) => ({ ...prev, approvalCriteria }));
    },
    [persist]
  );

  const setReaderFontSize = useCallback(
    (readerFontSize: number) => {
      persist((prev) => ({ ...prev, readerFontSize }));
    },
    [persist]
  );

  const setComfortableReadingMode = useCallback(
    (comfortableReadingMode: boolean) => {
      persist((prev) => ({ ...prev, comfortableReadingMode }));
    },
    [persist]
  );

  const getCourseDiagnostics = useCallback(
    (course: Course): CourseDiagnostics => {
      const totalLessons = getCourseLessonCount(course);
      const courseLessonIds = new Set(
        course.modules.flatMap((m) => m.lessons.map((l) => l.id))
      );
      const completedLessons = state.completedLessonIds.filter((id) =>
        courseLessonIds.has(id)
      ).length;
      const completionPct =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      const courseAttempts = Object.values(state.exerciseAttempts).filter(
        (a) => a.courseId === course.id
      );
      const exercisesAttempted = courseAttempts.length;
      const exercisesCorrect = courseAttempts.filter((a) => a.isCorrect).length;

      const courseAssessments = Object.values(state.assessmentResults).filter(
        (a) => a.courseId === course.id
      );
      const finalExamRecord = state.assessmentResults[course.finalExam.id];
      const midExamRecord = state.assessmentResults[course.intermediateExam.id];
      const finalProjectRecord = state.projectSubmissions[course.finalProject.id];

      const scores: number[] = [
        ...courseAssessments.map((a) => a.score),
        ...(finalProjectRecord ? [finalProjectRecord.score] : []),
      ];
      if (courseAttempts.length > 0) {
        const exPct = Math.round((exercisesCorrect / courseAttempts.length) * 100);
        scores.push(exPct);
      }

      const averageScore =
        scores.length > 0
          ? Math.round(scores.reduce((acc, s) => acc + s, 0) / scores.length)
          : 0;

      const finalExamPassed = Boolean(finalExamRecord?.passed);
      const intermediateExamPassed = Boolean(midExamRecord?.passed);
      const finalProjectSubmitted = Boolean(finalProjectRecord);
      const studyHours = Number(((state.studyMinutesByCourse[course.id] || 0) / 60).toFixed(1));

      const crit = state.approvalCriteria;
      const eligibleForCertificate =
        completionPct >= crit.minLessonCompletionPct &&
        averageScore >= crit.minAverageScore &&
        (!crit.requireFinalExam || finalExamPassed) &&
        (!crit.requireFinalProject || finalProjectSubmitted);

      const certificate = state.certificates.find((c) => c.courseId === course.id);

      return {
        enrolled: state.enrolledCourseIds.includes(course.id),
        totalLessons,
        completedLessons,
        completionPct,
        exercisesAttempted,
        exercisesCorrect,
        averageScore,
        finalExamPassed,
        intermediateExamPassed,
        finalProjectSubmitted,
        studyHours,
        eligibleForCertificate,
        certificate,
      };
    },
    [state]
  );

  const requestCertificate = useCallback(
    async (course: Course) => {
      const diag = getCourseDiagnostics(course);
      const result = await universityRepository.issueCertificate({
        courseId: course.id,
        courseTitle: course.title,
        totalHours: course.totalHours,
        studentName: state.user.name,
        studentEmail: state.user.email,
        competencies: course.competencies,
        lessonCompletionPct: diag.completionPct,
        averageScore: diag.averageScore,
        finalExamPassed: diag.finalExamPassed,
        finalProjectSubmitted: diag.finalProjectSubmitted,
        criteria: state.approvalCriteria,
      });
      if (result.certificate) {
        persist((prev) => {
          const exists = prev.certificates.some((c) => c.courseId === course.id);
          return exists
            ? prev
            : { ...prev, certificates: [...prev.certificates, result.certificate!] };
        });
      }
      return result;
    },
    [getCourseDiagnostics, persist, state.approvalCriteria, state.user.email, state.user.name]
  );

  return (
    <UniversityContext.Provider
      value={{
        state,
        loading,
        view,
        navigate,
        enrollInCourse,
        markLessonCompleted,
        setLastLesson,
        toggleFavoriteLesson,
        saveLessonNote,
        recordExerciseAttempt,
        recordAssessmentResult,
        submitProject,
        updateProfile,
        updateApprovalCriteria,
        setReaderFontSize,
        setComfortableReadingMode,
        requestCertificate,
        getCourseDiagnostics,
        logStudyMinutes,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
};

export function useUniversity(): UniversityContextValue {
  const ctx = useContext(UniversityContext);
  if (!ctx) {
    throw new Error('useUniversity must be used within UniversityProvider');
  }
  return ctx;
}

export function getAllEnrolledOrAvailableSummary(state: StudentState) {
  return ALL_COURSES.map((course) => ({
    course,
    enrolled: state.enrolledCourseIds.includes(course.id),
  }));
}
