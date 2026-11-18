import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '.data');
const DB_FILE = path.join(DATA_DIR, 'university-db.json');

interface PersistedDB {
  studentState: Record<string, unknown> | null;
  issuedCertificates: Record<string, unknown>[];
}

function ensureDB(): PersistedDB {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial: PersistedDB = {
      studentState: null,
      issuedCertificates: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as PersistedDB;
  } catch {
    return { studentState: null, issuedCertificates: [] };
  }
}

function saveDB(db: PersistedDB): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '4mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', institution: 'Instituto Meridiano', timestamp: new Date().toISOString() });
  });

  app.get('/api/student/state', (_req, res) => {
    const db = ensureDB();
    res.json({ state: db.studentState });
  });

  app.put('/api/student/state', (req, res) => {
    const { state } = req.body as { state?: Record<string, unknown> };
    if (!state || typeof state !== 'object') {
      res.status(400).json({ error: 'Estado do estudante inválido.' });
      return;
    }
    const db = ensureDB();
    db.studentState = state;
    saveDB(db);
    res.json({ saved: true, updatedAt: new Date().toISOString() });
  });

  app.post('/api/certificates/issue', (req, res) => {
    const payload = req.body as {
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
      criteria: {
        minLessonCompletionPct: number;
        minAverageScore: number;
        requireFinalExam: boolean;
        requireFinalProject: boolean;
      };
    };

    if (!payload?.courseId || !payload?.studentName || !payload?.criteria) {
      res.status(400).json({ error: 'Dados insuficientes para emissão de certificado.' });
      return;
    }

    const meetsLessons = payload.lessonCompletionPct >= payload.criteria.minLessonCompletionPct;
    const meetsScore = payload.averageScore >= payload.criteria.minAverageScore;
    const meetsExam = !payload.criteria.requireFinalExam || payload.finalExamPassed;
    const meetsProject = !payload.criteria.requireFinalProject || payload.finalProjectSubmitted;

    if (!meetsLessons || !meetsScore || !meetsExam || !meetsProject) {
      res.status(422).json({
        error: 'Critérios académicos mínimos ainda não foram cumpridos.',
        diagnostics: { meetsLessons, meetsScore, meetsExam, meetsProject },
      });
      return;
    }

    const db = ensureDB();
    const existing = db.issuedCertificates.find(
      (c) => c.courseId === payload.courseId && c.studentEmail === payload.studentEmail
    );
    if (existing) {
      res.json({ certificate: existing });
      return;
    }

    const hash = crypto
      .createHash('sha256')
      .update(`${payload.courseId}:${payload.studentEmail}:${Date.now()}`)
      .digest('hex')
      .slice(0, 8)
      .toUpperCase();

    const year = new Date().getFullYear();
    const verificationCode = `IM-${year}-${payload.courseId.toUpperCase().slice(0, 4)}-${hash}`;

    const certificate = {
      id: `cert-${crypto.randomUUID()}`,
      verificationCode,
      studentName: payload.studentName,
      studentEmail: payload.studentEmail,
      courseId: payload.courseId,
      courseTitle: payload.courseTitle,
      totalHours: payload.totalHours,
      finalScore: Math.round(payload.averageScore),
      issuedAt: new Date().toISOString(),
      issuerName: 'Instituto Meridiano — Universidade Digital de Formação Profissional',
      competencies: payload.competencies,
    };

    db.issuedCertificates.push(certificate);
    saveDB(db);

    res.status(201).json({ certificate });
  });

  app.get('/api/certificates/verify/:code', (req, res) => {
    const code = (req.params.code || '').trim().toUpperCase();
    if (!code) {
      res.status(400).json({ valid: false, error: 'Código de verificação não fornecido.' });
      return;
    }
    const db = ensureDB();
    const cert = db.issuedCertificates.find(
      (c) => String(c.verificationCode || '').toUpperCase() === code
    );
    if (!cert) {
      res.status(404).json({
        valid: false,
        error: 'Nenhum certificado oficial encontrado com este código de verificação.',
      });
      return;
    }
    res.json({ valid: true, certificate: cert });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Instituto Meridiano server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
