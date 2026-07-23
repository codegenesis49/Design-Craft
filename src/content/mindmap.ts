import { MindMapType, QuizQuestion } from '../types';

export interface LearnBlock {
  heading?: string;
  text?: string;
  bullets?: string[];
  note?: string;
  visual?: 'flowchart-symbols' | 'flowchart-sequence';
}
export interface LearnTab {
  id: string;
  title: string;
  blocks: LearnBlock[];
}

export const mindmapLearnTabs: LearnTab[] = [
  {
    id: 'definition',
    title: 'Definition',
    blocks: [
      { text: 'A mind map is a visual design tool used to organise and connect ideas around a central theme. Mind maps may also be called spider diagrams.' },
      { note: 'In OCR R050 you must know three types of mind map: Library, Tunnel Timeline and Presentation. Each has its own purpose — “Tunnel Timeline” is not simply another name for a spider diagram.' },
    ],
  },
  {
    id: 'purpose',
    title: 'Purpose & when to use',
    blocks: [
      { text: 'Mind maps are used early in a project to capture, organise and connect ideas before any detailed design work begins.' },
      {
        heading: 'Use a mind map when you need to…',
        bullets: [
          'Organise information from a client brief',
          'Break a big topic into smaller connected ideas',
          'Explore paths towards solving a problem (Tunnel Timeline)',
          'Sort collected research into categories (Library)',
          'Present connected ideas to an audience (Presentation)',
        ],
      },
      { note: 'A mind map plans ideas — it does not plan the exact layout of a screen (that needs a wireframe) and it does not formally represent process logic (that needs a flowchart).' },
    ],
  },
  {
    id: 'components',
    title: 'Components',
    blocks: [
      {
        bullets: [
          'Central node or theme — the main topic in the middle of the map',
          'Nodes — the main ideas branching from the centre',
          'Sub-nodes — smaller ideas that develop each node',
          'Connecting lines or branches — show which ideas are linked',
          'Keywords — short words or phrases, not long paragraphs',
          'Colours — group related branches and aid recall',
          'Images — support understanding and memory',
        ],
      },
      { text: 'Nodes may contain words, keywords, short phrases and/or images.' },
    ],
  },
  {
    id: 'software',
    title: 'Suitable software',
    blocks: [
      {
        heading: 'Software you could use',
        bullets: [
          'Desktop-publishing (DTP) software — precise control of text boxes, lines, colours and images',
          'Word-processing software — shapes and SmartArt-style diagrams are quick to create',
          'Specialist mind-mapping software — built-in node and branch tools',
          'Diagramming software — general-purpose shapes and connectors',
          'Presentation software — useful for a Presentation mind map',
          'Online whiteboards — good for collaborating on ideas',
        ],
      },
      { note: 'The exam expects you to know that everyday software such as DTP and word processors can be used — you do not need specialist software to draw a mind map.' },
    ],
  },
  {
    id: 'advantages',
    title: 'Advantages',
    blocks: [
      {
        bullets: [
          'Ideas can be added at any time.',
          'Helps users focus on ideas and the links between them.',
          'Shows dependent or related ideas.',
          'Organises information visually.',
          'Colours and images can support understanding and recall.',
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
          'Can be difficult for other people to understand.',
          'The correct type of mind map must be selected.',
          'Can become crowded.',
          'May not provide enough detail.',
          'Does not show precise interface layout.',
          'Does not formally represent process logic.',
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
          'Mind map vs flowchart — a mind map connects ideas; a flowchart shows the exact sequence, decisions and routes of a process using standard symbols.',
          'Mind map vs wireframe — a wireframe plans the positions of buttons, fields and content on a screen; a mind map does not show layout.',
          'Mind map vs visualisation diagram — a visualisation diagram shows how a finished product will look; a mind map only organises the ideas behind it.',
          'Mind map vs mood board — a mood board explores colours, fonts and imagery for a visual theme; a mind map organises information and ideas.',
        ],
      },
    ],
  },
];

export interface TypeCard {
  type: MindMapType;
  name: string;
  definition: string;
  whenToUse: string[];
  scenario: string;
  unsuitable: string;
}

export const typeCards: TypeCard[] = [
  {
    type: 'library',
    name: 'Library',
    definition: 'Sorts and organises collected information to provide a clear understanding of a topic. Sometimes called a reference mind map.',
    whenToUse: [
      'Organising information from a client brief',
      'Grouping users, requirements, inputs and outputs',
      'Researching a topic and grouping information into categories',
      'Showing relationships between related ideas',
      'Creating a visual reference',
    ],
    scenario: 'Organising the purpose, users, features, inputs, outputs and accessibility requirements of a hospital appointment system.',
    unsuitable: 'Showing the precise order of steps and decisions in the patient check-in process — a flowchart would be more appropriate.',
  },
  {
    type: 'tunnel',
    name: 'Tunnel Timeline',
    definition: 'Mainly used for problem-solving. The central node contains the problem to solve or the intended outcome; nodes and sub-nodes show the paths, actions or ideas that could lead to the solution.',
    whenToUse: [
      'Breaking down a problem',
      'Exploring possible solutions',
      'Showing paths towards an outcome',
      'Organising actions needed to solve a problem',
      'Comparing alternative routes towards a solution',
    ],
    scenario: 'Central node: “Create an accessible hospital appointment system”, with paths such as Investigate user needs, Design the interface, Test accessibility and Improve the solution.',
    unsuitable: 'Simply sorting collected information into categories without showing how it contributes towards solving a problem — a Library mind map would be more appropriate.',
  },
  {
    type: 'presentation',
    name: 'Presentation',
    definition: 'Presents ideas to an audience. The information must be organised so that the intended audience can understand it.',
    whenToUse: [
      'Presenting ideas to an audience',
      'Guiding an audience through a topic',
      'Supporting a spoken presentation',
      'Explaining the development of an idea',
      'Presenting connected information clearly',
    ],
    scenario: 'Presenting the stages, main features and benefits of a proposed school-registration system to school leaders.',
    unsuitable: 'Showing formal Yes/No routes after checking whether login information is valid — a flowchart would be more appropriate. A Presentation mind map is not a formal flowchart and does not use standard flowchart symbols.',
  },
];

export interface QuickQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  feedback: string;
}

export const mindmapQuickCheck: QuickQuestion[] = [
  {
    id: 'qc1',
    prompt: 'What sits at the centre of every mind map?',
    options: ['A decision diamond', 'The central node or theme', 'A sub-node', 'A flow line'],
    answer: 1,
    feedback: 'Correct answer: the central node or theme — because every branch of a mind map grows outwards from one central idea.',
  },
  {
    id: 'qc2',
    prompt: 'You need to group the hospital system’s users, inputs, outputs and accessibility requirements. Which type of mind map fits best?',
    options: ['Library', 'Tunnel Timeline', 'Presentation'],
    answer: 0,
    feedback: 'Library is correct because it sorts and organises collected information into categories, giving a clear reference for the topic.',
  },
  {
    id: 'qc3',
    prompt: 'A Tunnel Timeline mind map is mainly used to…',
    options: [
      'Show events in date order with milestones',
      'Show paths towards solving a problem or reaching an outcome',
      'Plan the position of buttons on a screen',
      'Record research sources',
    ],
    answer: 1,
    feedback: 'Correct because a Tunnel Timeline’s central node holds the problem or intended outcome, and its branches show the paths and actions that could lead to the solution. It does not need dates or chronological stages.',
  },
  {
    id: 'qc4',
    prompt: 'A designer wants to explore colours, fonts and imagery for the kiosk’s visual theme. Which tool should they use?',
    options: ['Mind map', 'Flowchart', 'Mood board', 'Wireframe'],
    answer: 2,
    feedback: 'Mood board is correct because it collects colours, fonts and imagery to explore a visual theme — a mind map organises ideas, not visual styling.',
  },
];

export const mindmapQuiz: QuizQuestion[] = [
  {
    id: 'mm1', topic: 'Definition',
    prompt: 'Which statement best defines a mind map?',
    options: [
      'A visual tool that organises and connects ideas around a central theme',
      'A diagram of the steps and decisions in a process, drawn with standard symbols',
      'A scale drawing showing where buttons and fields sit on a screen',
      'A collection of colours, fonts and images for a visual theme',
    ],
    answer: 0,
    explanation: 'The first option is correct because a mind map (also called a spider diagram) organises and connects ideas around one central theme. The others describe a flowchart, a wireframe and a mood board.',
  },
  {
    id: 'mm2', topic: 'Components',
    prompt: 'Which of these is NOT a component of a mind map?',
    options: ['Central node', 'Sub-node', 'Connecting branch', 'Decision diamond'],
    answer: 3,
    explanation: 'Decision diamond is correct because diamonds are a flowchart symbol. Mind maps are built from a central node, nodes, sub-nodes, branches, keywords, colours and images.',
  },
  {
    id: 'mm3', topic: 'Mind-map types',
    prompt: 'A student’s map has the problem “Reduce waiting times at reception” in the centre, with branches showing possible actions leading to a solution. Which type is it?',
    options: ['Library', 'Tunnel Timeline', 'Presentation'],
    answer: 1,
    explanation: 'Tunnel Timeline is correct because its central node holds a problem or intended outcome and its branches show paths towards solving it — its defining feature is problem-solving, not sorting or presenting.',
  },
  {
    id: 'mm4', topic: 'Mind-map types',
    prompt: 'Which statement about a Tunnel Timeline mind map is accurate?',
    options: [
      'It must show dates and chronological milestones',
      'It is just another name for a spider diagram',
      'It shows paths, actions or ideas leading towards a solution or outcome',
      'It uses standard flowchart symbols for inputs and decisions',
    ],
    answer: 2,
    explanation: 'The third option is correct because a Tunnel Timeline is mainly used for problem-solving: the centre states the problem or outcome and the branches show routes towards it. It does not require dates, and “Tunnel Timeline” is a specific type, not a general name for spider diagrams.',
  },
  {
    id: 'mm5', topic: 'Mind-map types',
    prompt: 'A team must guide school leaders through the features and benefits of a new registration system. Which mind-map type is most suitable?',
    options: ['Library', 'Tunnel Timeline', 'Presentation'],
    answer: 2,
    explanation: 'Presentation is correct because it organises connected information so that an intended audience can understand it while it is presented to them.',
  },
  {
    id: 'mm6', topic: 'Suitable software',
    prompt: 'Which pair of everyday software types can be used to create a mind map?',
    options: [
      'Desktop-publishing software and word-processing software',
      'Spreadsheet software and database software',
      'Video-editing software and audio-editing software',
      'Web browsers only',
    ],
    answer: 0,
    explanation: 'The first option is correct because DTP software gives precise control over text boxes, lines and images, and word processors include shapes and diagram tools — both can build a mind map without specialist software.',
  },
  {
    id: 'mm7', topic: 'Advantages',
    prompt: 'Which of these is an advantage of a mind map?',
    options: [
      'Ideas can be added at any time',
      'It shows the precise layout of an interface',
      'It formally represents process logic',
      'It can never become crowded',
    ],
    answer: 0,
    explanation: 'The first option is correct because a mind map grows organically — new ideas can be attached to any branch at any time. The other statements are either disadvantages or things a mind map cannot do.',
  },
  {
    id: 'mm8', topic: 'Disadvantages',
    prompt: 'Which of these is a disadvantage of a mind map?',
    options: [
      'It can be difficult for other people to understand',
      'Colours and images can support recall',
      'It shows the links between related ideas',
      'Information is organised visually',
    ],
    answer: 0,
    explanation: 'The first option is correct because a mind map often makes sense to the person who drew it, but its personal keywords and structure can confuse others. The other options are advantages.',
  },
  {
    id: 'mm9', topic: 'Choosing the right tool',
    prompt: 'A designer must show the accepted and rejected routes after a payment is checked. Why is a mind map NOT the best choice?',
    options: [
      'Because a mind map cannot use colour',
      'Because a flowchart can show the decision and the different routes followed when payment is accepted or rejected',
      'Because mind maps are only used for presentations',
      'Because a mood board would show the routes more clearly',
    ],
    answer: 1,
    explanation: 'The second option is correct because a flowchart uses a decision diamond with labelled Yes/No routes to formally represent alternative paths — a mind map does not formally represent process logic.',
  },
  {
    id: 'mm10', topic: 'Choosing the right tool',
    prompt: 'The hospital project needs the client brief broken into groups: users, inputs, outputs and accessibility. Which tool and type is most suitable?',
    options: [
      'A Library mind map',
      'A Tunnel Timeline mind map',
      'A wireframe',
      'A flowchart',
    ],
    answer: 0,
    explanation: 'A Library mind map is correct because it sorts and organises collected information into categories to give a clear understanding of the topic — exactly what the brief needs at this stage.',
  },
];

/** One-at-a-time prompts for Guided support, per mind-map type. */
export const guidedPrompts: Record<MindMapType, { text: string; component: string }[]> = {
  library: [
    { component: 'Central node', text: 'Your central topic has been added for you: “Hospital appointment system”. Select it to change its colour if you like.' },
    { component: 'Node', text: 'Add your first category as a main node connected to the centre. “Users” is a good start — who will use the kiosk?' },
    { component: 'Node', text: 'Add a second category: “Inputs”. What information must patients enter to find an appointment?' },
    { component: 'Node', text: 'Add “Outputs” and “Accessibility” as two more categories. A Library map needs at least four.' },
    { component: 'Sub-node', text: 'Develop “Users” with sub-nodes — for example patients, elderly visitors, wheelchair users, reception staff.' },
    { component: 'Sub-node', text: 'Develop your other categories with at least one sub-node each. Keep every idea to a keyword or short phrase.' },
    { component: 'Colours', text: 'Give each branch its own colour so the groups are easy to tell apart, then run the checklist on the right.' },
  ],
  tunnel: [
    { component: 'Central node', text: 'Your central node has been added: “Create an accessible hospital appointment system”. In a Tunnel Timeline the centre states the problem or intended outcome.' },
    { component: 'Node', text: 'Add your first path towards the outcome — for example “Investigate user needs”.' },
    { component: 'Node', text: 'Add more paths, such as “Design the interface”, “Select suitable hardware” or “Test accessibility”. You need at least three.' },
    { component: 'Sub-node', text: 'Develop one path with sub-nodes showing the actions it involves — e.g. under “Test accessibility”: screen reader check, large-text mode.' },
    { component: 'Sub-node', text: 'Develop your other paths so each shows how it moves the project towards the outcome.' },
    { component: 'Colours', text: 'Colour each path differently so alternative routes are easy to compare, then run the checklist on the right.' },
  ],
  presentation: [
    { component: 'Central node', text: 'Your central topic has been added: “Proposed hospital appointment kiosk”. This is what you will present to hospital managers.' },
    { component: 'Node', text: 'Add your first main section for the audience — for example “Why it is needed”.' },
    { component: 'Node', text: 'Add more sections, such as “Key features” and “Benefits for patients”. You need at least three, arranged so the audience can follow them.' },
    { component: 'Sub-node', text: 'Add short sub-points under each section — keep them brief enough to read at a glance.' },
    { component: 'Colours', text: 'Use colour to separate your sections, then run the checklist on the right.' },
  ],
};

/** Optional idea cards for Supported mode, per type. Students may also write their own. */
export const ideaCards: Record<MindMapType, string[]> = {
  library: ['Users', 'Inputs', 'Outputs', 'Accessibility', 'Hardware', 'Security', 'Patients', 'Reception staff', 'Appointment reference', 'Date of birth', 'Appointment details', 'Confirmation message', 'Large text', 'Audio support', 'Touchscreen', 'Wheelchair height'],
  tunnel: ['Investigate user needs', 'Design the interface', 'Select suitable hardware', 'Build the system', 'Test accessibility', 'Improve the solution', 'Interview patients', 'Observe reception', 'Sketch wireframes', 'Choose a touchscreen', 'Screen-reader check', 'Large-text mode'],
  presentation: ['Why it is needed', 'Key features', 'Benefits for patients', 'Benefits for staff', 'Next steps', 'Shorter queues', 'Simple three-step check-in', 'Accessible design', 'Less pressure on reception', 'Pilot in outpatients'],
};

export const supportedHints: Record<MindMapType, string[]> = {
  library: [
    'Start with the central topic, then add each category before developing it.',
    'Good categories for this brief: users, inputs, outputs, accessibility, hardware, security.',
    'Every node should be a keyword or short phrase from the brief — not a sentence.',
    'Use one colour per branch so the groups stand out.',
  ],
  tunnel: [
    'Put the problem or intended outcome in the central node.',
    'Each main node should be a path or action that moves you towards the outcome.',
    'Develop at least one path fully so it shows a complete route to a solution.',
    'You do not need dates or milestones — this is about solving the problem.',
  ],
  presentation: [
    'Think about your audience first: hospital managers who have not seen the idea before.',
    'Order your sections the way you would present them out loud.',
    'Keep every point short enough to read at a glance.',
    'Add sub-points that give the audience just enough detail.',
  ],
};
