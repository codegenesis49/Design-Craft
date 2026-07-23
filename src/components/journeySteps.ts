import { ModuleId } from '../types';

export interface StepDef {
  id: string;
  title: string;
}

const MINDMAP_STEPS: StepDef[] = [
  { id: 'learn', title: 'Read and Learn' },
  { id: 'check', title: 'Check Your Understanding' },
  { id: 'example', title: 'Worked example' },
  { id: 'type', title: 'Choose a mind-map type' },
  { id: 'support', title: 'Choose a support level' },
  { id: 'build', title: 'Build the design' },
  { id: 'review', title: 'Review against the checklist' },
  { id: 'justify', title: 'Explain your choices' },
  { id: 'quiz', title: 'Knowledge check' },
  { id: 'evidence', title: 'Save and export evidence' },
];

const FLOWCHART_STEPS: StepDef[] = [
  { id: 'learn', title: 'Read and Learn' },
  { id: 'check', title: 'Check Your Understanding' },
  { id: 'example', title: 'Worked example' },
  { id: 'support', title: 'Choose a support level' },
  { id: 'build', title: 'Build the design' },
  { id: 'review', title: 'Review against the checklist' },
  { id: 'justify', title: 'Explain your choices' },
  { id: 'quiz', title: 'Knowledge check' },
  { id: 'evidence', title: 'Save and export evidence' },
];

export function stepsFor(moduleId: ModuleId): StepDef[] {
  return moduleId === 'mindmap' ? MINDMAP_STEPS : FLOWCHART_STEPS;
}
export function totalSteps(moduleId: ModuleId): number {
  return stepsFor(moduleId).length;
}
export function stepTitles(moduleId: ModuleId): string[] {
  return stepsFor(moduleId).map((s) => s.title);
}
