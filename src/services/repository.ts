import { ApprovalCriteria, Certificate, StudentState } from '../types/university';

const LOCAL_MIRROR_KEY = 'instituto_meridiano_student_state_v1';

export const DEFAULT_APPROVAL_CRITERIA: ApprovalCriteria = {
  minLessonCompletionPct: 75,
  minAverageScore: 70,
  requireFinalExam: true,
  requireFinalProject: true,
};

export function createInitialStudentState(): StudentState {
  return {
    user: {
      id: 'stu-meridiano-01',
      name: 'Helena Vasconcelos',
      email: 'helena.vasconcelos@meridiano.edu',
      role: 'Estudante',
      institutionUnit: 'Faculdade Digital de Ciências Aplicadas',
      avatarInitials: 'HV',
      joinedAt: new Date().toISOString().slice(0, 10),
    },
    enrolledCourseIds: ['curso-01-ia'],
    completedLessonIds: [],
    favoriteLessonIds: [],
    lastLessonByCourse: {},
    notesByLesson: {},
    exerciseAttempts: {},
    assessmentResults: {},
    projectSubmissions: {},
    studyMinutesByCourse: {},
    dailyStudyMinutes: [
      { day: 'Seg', minutes: 0 },
      { day: 'Ter', minutes: 0 },
      { day: 'Qua', minutes: 0 },
      { day: 'Qui', minutes: 0 },
      { day: 'Sex', minutes: 0 },
      { day: 'Sáb', minutes: 0 },
      { day: 'Dom', minutes: 0 },
    ],
    certificates: [],
    approvalCriteria: DEFAULT_APPROVAL_CRITERIA,
    readerFontSize: 16,
    comfortableReadingMode: false,
  };
}

/**
 * Interface preparada para integração futura com Supabase (Auth + PostgreSQL).
 * Actualmente ligada à API REST Express (/api/*) com persistência em ficheiro.
 */
export interface UniversityRepository {
  loadStudentState(): Promise<StudentState>;
  saveStudentState(state: StudentState): Promise<void>;
  issueCertificate(payload: {
    courseId: string;
    courseTitle: string;
    totalHours: number;
    studentName: string;
    studentEmail: string;
    competencies: string[];
    lessonCompletionPct: number;
    averageScore: number;
    finalExamPassed: boolean;
    finalProjectSubmitted: boolean;
    criteria: ApprovalCriteria;
  }): Promise<{ certificate?: Certificate; error?: string }>;
  verifyCertificate(code: string): Promise<{ valid: boolean; certificate?: Certificate; error?: string }>;
}

export const universityRepository: UniversityRepository = {
  async loadStudentState(): Promise<StudentState> {
    try {
      const response = await fetch('/api/student/state');
      if (response.ok) {
        const data = (await response.json()) as { state: StudentState | null };
        if (data.state) {
          localStorage.setItem(LOCAL_MIRROR_KEY, JSON.stringify(data.state));
          return data.state;
        }
      }
    } catch {
      // Fallback to local mirror if server temporarily unreachable
    }
    try {
      const local = localStorage.getItem(LOCAL_MIRROR_KEY);
      if (local) {
        return JSON.parse(local) as StudentState;
      }
    } catch {
      // Ignore parse error
    }
    const initial = createInitialStudentState();
    await this.saveStudentState(initial);
    return initial;
  },

  async saveStudentState(state: StudentState): Promise<void> {
    try {
      localStorage.setItem(LOCAL_MIRROR_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
    try {
      await fetch('/api/student/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
      });
    } catch {
      // Keep local mirror intact
    }
  },

  async issueCertificate(payload) {
    const response = await fetch('/api/certificates/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { certificate?: Certificate; error?: string };
    if (!response.ok) {
      return { error: data.error || 'Critérios académicos não cumpridos.' };
    }
    return { certificate: data.certificate };
  },

  async verifyCertificate(code: string) {
    const clean = encodeURIComponent(code.trim().toUpperCase());
    const response = await fetch(`/api/certificates/verify/${clean}`);
    const data = (await response.json()) as { valid: boolean; certificate?: Certificate; error?: string };
    return data;
  },
};
