import { QuizQuestion } from '../types';
import { LearnTab, QuickQuestion } from './mindmap';

export const flowchartLearnTabs: LearnTab[] = [
  {
    id: 'definition',
    title: 'Definition',
    blocks: [
      { text: 'A flowchart is a visual representation of the steps, processing and decisions within a process. Standard symbols are connected using directional flow lines.' },
      { note: 'Because the symbols are standard, anyone who knows them can read your flowchart — even without seeing any program code.' },
    ],
  },
  {
    id: 'purpose',
    title: 'Purpose & when to use',
    blocks: [
      {
        heading: 'Use a flowchart to…',
        bullets: [
          'Plan a process',
          'Show a sequence of actions',
          'Represent decisions and alternative routes',
          'Plan validation and error handling',
          'Plan an algorithm',
          'Explain how a system responds to input',
        ],
      },
      { note: 'A flowchart shows what a system does, step by step. It does not show what the interface looks like — that needs a wireframe or visualisation diagram.' },
    ],
  },
  {
    id: 'sequence',
    title: 'What is sequence?',
    blocks: [
      {
        text: 'Sequence is the order in which instructions or actions happen. In a simple sequence, each step is completed once and the next step follows in order.',
      },
      {
        heading: 'A simple sequence',
        visual: 'flowchart-sequence',
      },
      {
        note: 'Follow the arrows from Start: enter the appointment reference → check the reference → display the result → End. A decision can later split this sequence into different routes, and a loop can send the flow back to repeat a step.',
      },
    ],
  },
  {
    id: 'components',
    title: 'Components',
    blocks: [
      {
        heading: 'Core assessed components',
        visual: 'flowchart-symbols',
      },
      { text: 'An optional connector (small circle) can link sections of a larger diagram. The five core components are Start/End, Process, Decision, Input/Output and Flow Line. Yes/No or True/False labels explain the routes leaving a decision.' },
    ],
  },
  {
    id: 'software',
    title: 'Suitable software',
    blocks: [
      {
        bullets: [
          'Diagramming software — ready-made flowchart symbols and connectors',
          'Word-processing software — flowchart shapes are included in the shape tools',
          'Desktop-publishing software — precise control over shapes and lines',
          'Presentation software — shapes and connectors on slides',
        ],
      },
    ],
  },
  {
    id: 'advantages',
    title: 'Advantages',
    blocks: [
      {
        bullets: [
          'Clearly shows sequence.',
          'Shows decisions and alternative routes.',
          'Helps identify missing steps and logical errors.',
          'Can be understood without reading program code.',
          'Provides a useful development plan.',
          'Digital flowcharts can be edited.',
        ],
      },
    ],
  },
  {
    id: 'disadvantages',
    title: 'Disadvantages',
    blocks: [
      {
        bullets: [
          'Large flowcharts can become complicated.',
          'Users must understand the standard symbols.',
          'Hand-drawn versions can be difficult to change.',
          'Specialist software may be required.',
          'Does not show the appearance of an interface.',
          'Complex diagrams may contain crossing lines.',
        ],
      },
    ],
  },
  {
    id: 'comparison',
    title: 'Compared with other tools',
    blocks: [
      {
        bullets: [
          'Flowchart vs mind map — a flowchart shows an exact sequence with decisions and routes; a mind map connects ideas without formal logic.',
          'Flowchart vs wireframe — a flowchart shows what happens; a wireframe shows where things sit on the screen.',
          'Flowchart vs visualisation diagram — a visualisation diagram shows how a finished product will look, not the process behind it.',
          'Flowchart vs mood board — a mood board explores a visual theme; it says nothing about process logic.',
        ],
      },
    ],
  },
];

export const flowchartQuickCheck: QuickQuestion[] = [
  {
    id: 'fqc1',
    prompt: 'Which symbol represents a decision in a flowchart?',
    options: ['Rectangle', 'Diamond', 'Parallelogram', 'Rounded rectangle'],
    answer: 1,
    feedback: 'Diamond is correct because a decision asks a question with alternative routes — the rectangle is a process, the parallelogram is input/output and the rounded rectangle is a terminator.',
  },
  {
    id: 'fqc2',
    prompt: '“Enter date of birth” should be drawn in which symbol?',
    options: ['Process rectangle', 'Input/Output parallelogram', 'Decision diamond', 'Terminator'],
    answer: 1,
    feedback: 'Input/Output parallelogram is correct because the patient is entering data into the system — a process rectangle is for actions the system performs.',
  },
  {
    id: 'fqc3',
    prompt: 'A designer must show accepted and rejected payment routes. Which design tool is most suitable?',
    options: ['Flowchart', 'Mood board', 'Library mind map', 'Visualisation diagram'],
    answer: 0,
    feedback: 'Flowchart is correct because it can show the decision and the different routes followed when payment is accepted or rejected.',
  },
  {
    id: 'fqc4',
    prompt: 'What must every route leaving a decision diamond have?',
    options: ['A colour', 'A meaningful label such as Yes/No or True/False', 'An image', 'A connector circle'],
    answer: 1,
    feedback: 'Correct because without Yes/No or True/False labels the reader cannot tell which route to follow after the decision.',
  },
];

export const flowchartQuiz: QuizQuestion[] = [
  {
    id: 'fc1', topic: 'Definition',
    prompt: 'Which statement best defines a flowchart?',
    options: [
      'A visual representation of the steps, processing and decisions within a process, using standard symbols and directional flow lines',
      'A visual tool that organises ideas around a central theme',
      'A drawing of the layout of buttons and fields on a screen',
      'A board of colours, fonts and imagery for a design theme',
    ],
    answer: 0,
    explanation: 'The first option is correct because a flowchart uses standard, connected symbols to show steps, processing and decisions. The others describe a mind map, a wireframe and a mood board.',
  },
  {
    id: 'fc2', topic: 'Components',
    prompt: 'Which symbol marks the start or end of a flowchart?',
    options: ['A rounded rectangle or oval (terminator)', 'A diamond', 'A parallelogram', 'A rectangle'],
    answer: 0,
    explanation: 'The terminator is correct because rounded rectangles or ovals are the standard symbol that shows where a process begins and ends.',
  },
  {
    id: 'fc3', topic: 'Components',
    prompt: '“Display appointment details” should be drawn in which symbol?',
    options: ['Input/Output parallelogram', 'Decision diamond', 'Terminator', 'Connector circle'],
    answer: 0,
    explanation: 'Input/Output parallelogram is correct because displaying details is data leaving the system (an output) — it is not a question, and it is not the start or end of the process.',
  },
  {
    id: 'fc4', topic: 'Components',
    prompt: '“Are the details valid?” should be drawn in which symbol?',
    options: ['Decision diamond', 'Process rectangle', 'Input/Output parallelogram', 'Terminator'],
    answer: 0,
    explanation: 'Decision diamond is correct because the system is asking a question with two possible routes — Yes and No — and only a decision can branch the process.',
  },
  {
    id: 'fc5', topic: 'When to use',
    prompt: 'When is a flowchart the most suitable design tool?',
    options: [
      'When planning validation, decisions and error handling in a process',
      'When exploring colours and fonts for a visual theme',
      'When grouping research into categories',
      'When planning where buttons sit on a screen',
    ],
    answer: 0,
    explanation: 'The first option is correct because flowcharts represent sequence, decisions and alternative routes — exactly what validation and error handling need. The others suit a mood board, a Library mind map and a wireframe.',
  },
  {
    id: 'fc6', topic: 'Advantages',
    prompt: 'Which of these is an advantage of a flowchart?',
    options: [
      'It helps identify missing steps and logical errors before a system is built',
      'It shows the appearance of the interface',
      'It never becomes complicated',
      'It removes the need for testing',
    ],
    answer: 0,
    explanation: 'The first option is correct because following the routes of a flowchart reveals missing steps and faulty logic early, when they are cheap to fix. Flowcharts never show interface appearance, and large ones can become complicated.',
  },
  {
    id: 'fc7', topic: 'Disadvantages',
    prompt: 'Which of these is a disadvantage of a flowchart?',
    options: [
      'Users must understand the standard symbols to read it',
      'It clearly shows sequence',
      'It can be understood without reading program code',
      'Digital versions can be edited',
    ],
    answer: 0,
    explanation: 'The first option is correct because someone who does not know the standard symbols cannot read the diagram — the other options are all advantages.',
  },
  {
    id: 'fc8', topic: 'Decision routes',
    prompt: 'A decision diamond in a finished flowchart must have…',
    options: [
      'At least two outgoing routes with meaningful labels such as Yes/No',
      'Exactly one outgoing route',
      'No outgoing routes',
      'A colour and an image',
    ],
    answer: 0,
    explanation: 'The first option is correct because a decision splits the process into alternative routes, and labels such as Yes/No or True/False tell the reader which route to follow.',
  },
  {
    id: 'fc9', topic: 'Choosing the right tool',
    prompt: 'The hospital team must plan the positions of buttons and input fields on the kiosk screen. Why is a flowchart NOT the right tool?',
    options: [
      'Because a wireframe plans screen layout, while a flowchart only shows the steps and decisions of the process',
      'Because flowcharts cannot include inputs',
      'Because a mood board shows button positions',
      'Because flowcharts cannot be drawn digitally',
    ],
    answer: 0,
    explanation: 'The first option is correct because a flowchart does not show the appearance of an interface — a wireframe is the tool that plans where buttons and fields are positioned.',
  },
  {
    id: 'fc10', topic: 'Choosing the right tool',
    prompt: 'Early in the project, the team wants to break the client brief into groups of connected ideas before planning any logic. Which tool should they use first?',
    options: [
      'A mind map, then a flowchart',
      'A flowchart, then a mood board',
      'A connector circle',
      'A visualisation diagram only',
    ],
    answer: 0,
    explanation: 'The first option is correct because a mind map organises and connects the ideas in the brief, and a flowchart then turns the chosen process into a formal sequence with decisions.',
  },
];

/** One-at-a-time build prompts for Guided support (progressive — never the full answer at once). */
export const flowchartGuidedPrompts: { text: string; component: string }[] = [
  { component: 'Start terminator', text: 'Every flowchart begins with a Start terminator \u2014 yours is already on the canvas. Select it to see its properties on the right.' },
  { component: 'Output', text: 'The kiosk greets the patient first. Add an Input/Output symbol for displaying the welcome screen and connect Start to it.' },
  { component: 'Input', text: 'The patient must identify their appointment. Add Input symbols for entering an appointment reference and a date of birth.' },
  { component: 'Process', text: 'The system now works with that data. Add a Process rectangle for checking the details.' },
  { component: 'Decision', text: 'Add a Decision diamond asking whether the details are valid. Give it two routes and label them Yes and No.' },
  { component: 'No route', text: 'On the No route, display an error and let the patient try again — connect the route back so they can re-enter their details.' },
  { component: 'Yes route', text: 'On the Yes route, the system retrieves the appointment. Then add a second Decision: was an appointment found? Label its routes too.' },
  { component: 'Outputs & End', text: 'Finish both routes: if not found, display help instructions; if found, display the appointment, ask the patient to confirm, output the confirmation and connect to End.' },
];

export const flowchartSupportedHints: string[] = [
  'Work top to bottom: Start → welcome screen → inputs → check → decisions → outputs → End.',
  'The patient needs to enter two pieces of data before the system can check anything.',
  'You will need two decisions: one for valid details, one for whether an appointment was found.',
  'The No route from the first decision should let the patient try again — a loop back is fine.',
  'Label every decision route Yes/No before you run the checklist.',
];
