import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { ModuleId, SavedRecord } from '../types';
import { dataService } from '../data/dataService';
import { stepsFor } from './journeySteps';
import LearnStep from './steps/LearnStep';
import QuickCheckStep from './steps/QuickCheckStep';
import WorkedExampleStep from './steps/WorkedExampleStep';
import TypeSelectStep from './steps/TypeSelectStep';
import SupportSelectStep from './steps/SupportSelectStep';
import BuildStep from './steps/BuildStep';
import ReviewStep from './steps/ReviewStep';
import JustifyStep from './steps/JustifyStep';
import QuizStep from './steps/QuizStep';
import EvidenceStep from './steps/EvidenceStep';

export interface StepProps {
  moduleId: ModuleId;
  record: SavedRecord;
  update: (patch: Partial<SavedRecord>) => void;
  /** step reports whether the learner may continue */
  setCanContinue: (ok: boolean) => void;
  goNext: () => void;
}

export default function Journey({ moduleId }: { moduleId: ModuleId }) {
  const steps = stepsFor(moduleId);
  const [record, setRecord] = useState<SavedRecord>(() => dataService.load(moduleId));
  const [current, setCurrent] = useState(() => Math.min(dataService.load(moduleId).maxStep, steps.length - 1));
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const r = dataService.load(moduleId);
    setRecord(r);
    setCurrent(Math.min(r.maxStep, steps.length - 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  const update = useCallback(
    (patch: Partial<SavedRecord>) => {
      setRecord((prev) => dataService.save({ ...prev, ...patch }));
    },
    []
  );

  const goTo = useCallback(
    (i: number) => {
      if (i < 0 || i >= steps.length) return;
      setCanContinue(false);
      setCurrent(i);
      window.scrollTo({ top: 0 });
    },
    [steps.length]
  );

  const goNext = useCallback(() => {
    const next = current + 1;
    if (next >= steps.length) return;
    setRecord((prev) => {
      const maxStep = Math.max(prev.maxStep, next);
      const complete = maxStep >= steps.length - 1 && prev.submittedAt != null;
      return dataService.save({ ...prev, maxStep, completionStatus: complete ? 'complete' : prev.completionStatus });
    });
    goTo(next);
  }, [current, goTo, steps.length]);

  const step = steps[current];
  const props: StepProps = { moduleId, record, update, setCanContinue, goNext };

  const body = useMemo(() => {
    switch (step.id) {
      case 'learn': return <LearnStep {...props} />;
      case 'check': return <QuickCheckStep {...props} />;
      case 'example': return <WorkedExampleStep {...props} />;
      case 'type': return <TypeSelectStep {...props} />;
      case 'support': return <SupportSelectStep {...props} />;
      case 'build': return <BuildStep {...props} />;
      case 'review': return <ReviewStep {...props} />;
      case 'justify': return <JustifyStep {...props} />;
      case 'quiz': return <QuizStep {...props} />;
      case 'evidence': return <EvidenceStep {...props} />;
      default: return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id, record, moduleId]);

  const isBuild = step.id === 'build';

  return (
    <div className="page" style={isBuild ? { maxWidth: 'none', paddingBottom: 16 } : undefined}>
      <div className="journey" style={isBuild ? { gridTemplateColumns: '1fr' } : undefined}>
        {!isBuild && (
          <nav className="step-rail" aria-label="Lesson steps">
            {steps.map((s, i) => {
              const unlocked = i <= record.maxStep;
              const done = i < record.maxStep || (i === steps.length - 1 && record.completionStatus === 'complete');
              return (
                <button
                  key={s.id}
                  className={`step-item ${i === current ? 'active' : ''} ${done ? 'done' : ''}`}
                  onClick={() => unlocked && goTo(i)}
                  disabled={!unlocked}
                  aria-current={i === current ? 'step' : undefined}
                  data-tip={unlocked ? undefined : 'Complete the earlier steps first'}
                >
                  <span className="step-dot" aria-hidden="true">{done ? <Check size={12} /> : i + 1}</span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </nav>
        )}
        <div className="journey-body">
          {body}
          <div className="journey-footer no-print">
            <button className="btn btn-secondary" onClick={() => goTo(current - 1)} disabled={current === 0}>
              <ArrowLeft size={16} /> Back
            </button>
            {current < steps.length - 1 && (
              <button
                className="btn btn-primary"
                onClick={goNext}
                disabled={!canContinue}
                data-tip={canContinue ? undefined : 'Finish this step to continue'}
              >
                Continue <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
