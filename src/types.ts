export type ModuleId = 'mindmap' | 'flowchart';
export type SupportLevel = 'guided' | 'supported' | 'independent';
export type MindMapType = 'library' | 'tunnel' | 'presentation';
export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface CheckResult {
  id: string;
  label: string;
  status: CheckStatus;
  message: string;
}

export interface QuizQuestion {
  id: string;
  topic: string; // used for "topics to revisit"
  prompt: string;
  options: string[];
  answer: number; // index into options as authored
  explanation: string; // must contain a "because" statement
  fixedOrder?: boolean; // don't shuffle options (e.g. "All of the above")
}

export interface AttemptResult {
  score: number;
  total: number;
  /** for each authored question id, the option text the student chose */
  answers: Record<string, string>;
  at: string;
}

export interface ArtifactNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}
export interface ArtifactEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string;
}
export interface ArtifactData {
  nodes: ArtifactNode[];
  edges: ArtifactEdge[];
}

export interface JustificationAnswers {
  suitable: string;
  helped: string;
  limitation: string;
  next: string;
}

export interface SavedRecord {
  schemaVersion: 1;
  studentId: null;
  classId: null;
  assignmentId: null;
  projectId: string;
  moduleId: ModuleId;
  lessonId: string;
  selectedTool: string;
  selectedMindMapType: MindMapType | null;
  supportLevel: SupportLevel | null;
  artifactData: ArtifactData | null;
  checklistResults: CheckResult[] | null;
  writtenJustification: JustificationAnswers | null;
  attemptNumber: number; // 0 = not attempted, 1 = first, 2 = retry done
  firstScore: AttemptResult | null;
  retryScore: AttemptResult | null;
  startedAt: string | null;
  lastSavedAt: string | null;
  submittedAt: string | null;
  completionStatus: 'not-started' | 'in-progress' | 'complete';
  /** highest journey step the student has unlocked (index) */
  maxStep: number;
  quickCheckDone: boolean;
}

export const PROJECT_ID = 'hospital-appointments';

export const PROJECT_BRIEF =
  'Design a hospital self-service appointment system that allows patients to find and confirm their appointments. The system must be accessible, simple to use and suitable for a busy reception area.';

export function newRecord(moduleId: ModuleId): SavedRecord {
  return {
    schemaVersion: 1,
    studentId: null,
    classId: null,
    assignmentId: null,
    projectId: PROJECT_ID,
    moduleId,
    lessonId: `${moduleId}-r050-ta1`,
    selectedTool: moduleId === 'mindmap' ? 'Mind map' : 'Flowchart',
    selectedMindMapType: null,
    supportLevel: null,
    artifactData: null,
    checklistResults: null,
    writtenJustification: null,
    attemptNumber: 0,
    firstScore: null,
    retryScore: null,
    startedAt: null,
    lastSavedAt: null,
    submittedAt: null,
    completionStatus: 'not-started',
    maxStep: 0,
    quickCheckDone: false,
  };
}
