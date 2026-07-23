type SymbolKind = 'terminator' | 'process' | 'decision' | 'input-output' | 'flow-line' | 'decision-labels';

interface SymbolCard {
  kind: SymbolKind;
  name: string;
  description: string;
  example: string;
}

const symbols: SymbolCard[] = [
  {
    kind: 'terminator',
    name: 'Start / End',
    description: 'Rounded rectangle or oval',
    example: 'Marks where the flow begins or finishes.',
  },
  {
    kind: 'process',
    name: 'Process',
    description: 'Rectangle',
    example: 'Shows an action or calculation.',
  },
  {
    kind: 'decision',
    name: 'Decision',
    description: 'Diamond',
    example: 'Asks a question that creates alternative routes.',
  },
  {
    kind: 'input-output',
    name: 'Input / Output',
    description: 'Parallelogram',
    example: 'Shows data entering or leaving the system.',
  },
  {
    kind: 'flow-line',
    name: 'Flow line',
    description: 'Directional arrow',
    example: 'Shows the order and direction of the steps.',
  },
  {
    kind: 'decision-labels',
    name: 'Decision labels',
    description: 'Yes / No or True / False',
    example: 'Explain which route to follow after a decision.',
  },
];

function SymbolSvg({ kind }: { kind: SymbolKind }) {
  const common = {
    fill: '#ffffff',
    stroke: '#2b41ad',
    strokeWidth: 3,
  };

  return (
    <svg
      className="learn-symbol-svg"
      viewBox="0 0 180 92"
      role="img"
      aria-label={`${symbols.find((symbol) => symbol.kind === kind)?.name} flowchart symbol`}
    >
      {kind === 'terminator' && <rect x="22" y="23" width="136" height="46" rx="23" {...common} />}
      {kind === 'process' && <rect x="25" y="22" width="130" height="48" rx="2" {...common} />}
      {kind === 'decision' && <polygon points="90,10 160,46 90,82 20,46" {...common} />}
      {kind === 'input-output' && <polygon points="42,20 164,20 138,72 16,72" {...common} />}
      {kind === 'flow-line' && (
        <>
          <line x1="18" y1="46" x2="148" y2="46" stroke="#2b41ad" strokeWidth="4" strokeLinecap="round" />
          <polygon points="148,34 168,46 148,58" fill="#2b41ad" />
        </>
      )}
      {kind === 'decision-labels' && (
        <>
          <polygon points="90,8 140,34 90,60 40,34" {...common} />
          <line x1="40" y1="34" x2="15" y2="76" stroke="#2b41ad" strokeWidth="3" />
          <line x1="140" y1="34" x2="165" y2="76" stroke="#2b41ad" strokeWidth="3" />
          <text x="8" y="90" className="learn-symbol-label">No</text>
          <text x="148" y="90" className="learn-symbol-label">Yes</text>
        </>
      )}
    </svg>
  );
}

export function FlowchartSymbolGuide() {
  return (
    <div className="symbol-guide" aria-label="Flowchart symbols and their meanings">
      {symbols.map((symbol) => (
        <article className="symbol-card" key={symbol.kind}>
          <div className="symbol-picture">
            <SymbolSvg kind={symbol.kind} />
          </div>
          <div>
            <h4>{symbol.name}</h4>
            <p className="symbol-shape-name">{symbol.description}</p>
            <p className="small muted">{symbol.example}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

interface SequenceStepProps {
  kind: 'terminator' | 'input-output' | 'process';
  label: string;
}

function SequenceStep({ kind, label }: SequenceStepProps) {
  return (
    <div className={`sequence-step sequence-${kind}`}>
      <span>{label}</span>
    </div>
  );
}

export function FlowchartSequenceExample() {
  return (
    <div className="sequence-example" aria-label="Example sequence: Start, enter appointment reference, check reference, display result, End">
      <SequenceStep kind="terminator" label="Start" />
      <span className="sequence-arrow" aria-hidden="true">→</span>
      <SequenceStep kind="input-output" label="Enter appointment reference" />
      <span className="sequence-arrow" aria-hidden="true">→</span>
      <SequenceStep kind="process" label="Check reference" />
      <span className="sequence-arrow" aria-hidden="true">→</span>
      <SequenceStep kind="input-output" label="Display result" />
      <span className="sequence-arrow" aria-hidden="true">→</span>
      <SequenceStep kind="terminator" label="End" />
    </div>
  );
}
