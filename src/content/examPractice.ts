import { QuizQuestion } from '../types';
import { ProjectTool } from '../data/projects';
export interface PracticeQuestion extends QuizQuestion { source: string; }
const q=(id:string,topic:string,prompt:string,options:string[],explanation:string,source='Original supplementary practice'):PracticeQuestion=>({id,topic,prompt,options,answer:0,explanation,source});
const mm='Adapted skill: OCR R050 January 2024, Q1 (mind-map components)';
const fc='Adapted skill: OCR R050 sample paper, Q1 (flowchart components)';
const wf='Adapted skill: OCR R050 January 2025, Q1 (wireframe components)';
const vd='Adapted skill: OCR R050 January 2024 (visualisation diagram and DTP questions)';
export const practiceBanks:Record<ProjectTool,PracticeQuestion[]>={
  mindmap:[
    q('p-mm1','Mind-map components','What belongs at the centre of a mind map?',['The main topic','The software licence','A page number','Every supporting detail'],'The central focus names the main topic because all branches relate to it.',mm),
    q('p-mm2','Mind-map components','What do connecting lines show in a mind map?',['Relationships between ideas','The number of printed pages','The size of a file','The duration of a video'],'Connecting lines show which ideas are related because they join the relevant nodes.',mm),
    q('p-mm3','Mind-map structure','What is the role of a sub-node?',['To add detail to a related idea','To end a process','To display a page footer','To set the paper size'],'A sub-node expands another idea because it gives more specific information.','Adapted skill: OCR R050 sample and January 2025 mind-map construction tasks'),
    q('p-mm4','Mind-map wording','Which wording is usually most suitable for a mind-map node?',['A keyword or short phrase','A full essay','An unrelated quotation','A block of program code'],'Short wording is useful because it keeps the map concise and easy to scan.'),
    q('p-mm5','Mind-map types','Which type of mind map primarily organises information for reference?',['Library mind map','Flowchart','Wireframe','Visualisation diagram'],'A library mind map supports reference because it groups related information about a topic.')
  ],
  flowchart:[
    q('p-fc1','Flowchart components','Which symbol normally represents a decision?',['Diamond','Rectangle','Parallelogram','Oval'],'A diamond represents a decision because its outgoing routes depend on a test.',fc),
    q('p-fc2','Flowchart components','Which symbol normally represents input or output?',['Parallelogram','Diamond','Circle','Rectangle'],'A parallelogram marks input/output because it represents data entering or leaving the process.',fc),
    q('p-fc3','Flowchart components','What does a terminator symbol identify?',['The start or end','A calculation','An input value','A colour choice'],'A terminator identifies a boundary because it shows where the process begins or finishes.',fc),
    q('p-fc4','Flow lines','Why are arrows included on flow lines?',['To show the direction of the process','To set a font size','To mark an image position','To list the target audience'],'Arrows clarify the route because they show which step follows another.',fc),
    q('p-fc5','Decision routes','Which pair of labels can identify two decision outcomes?',['Yes and No','Heading and Footer','Image and Font','Large and Bold'],'Yes and No label alternative outcomes because they indicate whether a condition is met.')
  ],
  wireframe:[
    q('p-wf1','Wireframe components','Which is a typical component of a screen wireframe?',['A button placeholder','A decryption key','A network address','A flowchart terminator'],'A button placeholder belongs in a wireframe because it shows a planned interactive element.',wf),
    q('p-wf2','Wireframe components','What does an image placeholder indicate?',['Where an image will be positioned','That an image has been encrypted','The image file’s owner','The number of animation frames'],'A placeholder reserves space because the final image may not yet be available.',wf),
    q('p-wf3','Wireframe purpose','What is a wireframe mainly used to plan?',['Structure, layout and navigation','Malware detection','Network transmission speed','Video recording quality'],'A wireframe prioritises structure because it shows the arrangement and relationship of screen elements.'),
    q('p-wf4','Wireframe limitations','What does a wireframe NOT prove on its own?',['That the finished system will function correctly','Where a heading is planned','Where a button is planned','How content is arranged'],'The wireframe is a plan because the underlying functionality still needs implementation and testing.'),
    q('p-wf5','Wireframe benefits','Why is an early wireframe useful?',['It allows layout feedback before development','It automatically writes every program','It guarantees that no testing is needed','It replaces all user requirements'],'It supports early feedback because layout changes are easier to discuss before building the finished system.')
  ],
  visualisation:[
    q('p-vd1','Visualisation components','Which detail is useful in an annotation?',['The intended font size and colour','An unrelated password','A random file name','An unexplained number'],'An annotation explains a design choice because a rough layout may not show the exact appearance.',vd),
    q('p-vd2','Visualisation purpose','What does a visualisation diagram primarily plan?',['The appearance of a static product','The route taken by network packets','The exact running time of every video frame','The order of program execution'],'It plans a static appearance because it shows the intended layout and design details.',vd),
    q('p-vd3','Design software','Which DTP feature helps arrange a visualisation diagram?',['Moving and aligning text and image boxes','Scanning for viruses','Resetting a router','Compiling source code'],'Alignment tools help because they position the planned content accurately.',vd),
    q('p-vd4','Plan and product','Which statement distinguishes a visualisation diagram from a finished flyer?',['The diagram plans the flyer’s appearance','The diagram must contain no labels','The flyer is a flowchart','The diagram is always executable software'],'The plan communicates intended appearance because the finished flyer is created from the agreed design.'),
    q('p-vd5','Visualisation limitations','Why can a visualisation diagram be misinterpreted?',['Its annotations may be unclear or incomplete','It always contains too many frames','It cannot contain any images','It must always use a database'],'Unclear notes can lead to different interpretations because important design details are not specified.')
  ],
  moodboard:[
    q('p-mb1','Mood-board purpose','What is the main purpose of a mood board?',['Communicating a visual theme','Showing exact program logic','Storing login credentials','Calculating a total'],'A mood board communicates a theme because it collects related visual inspiration.'),
    q('p-mb2','Mood-board components','Which collection is most suitable for a mood board?',['Images, colours, fonts and keywords','Passwords and encryption keys','IP addresses and subnet masks','Only flowchart decisions'],'These elements communicate visual direction because they suggest the proposed style.'),
    q('p-mb3','Mood-board limitations','What does a mood board usually NOT specify precisely?',['The final positions of every interface element','A possible colour palette','An intended visual tone','Typography inspiration'],'A mood board explores style because it is not a precise layout plan.'),
    q('p-mb4','Typography','What does typography concern?',['The choice and arrangement of text','The speed of a network','The order of decisions','The number of stored records'],'Typography concerns text presentation because typeface and arrangement affect the design.'),
    q('p-mb5','Mood-board benefits','How can a mood board help a design team?',['It provides a shared visual direction','It guarantees automatic programming','It removes the need for feedback','It replaces every other design tool'],'Shared inspiration helps because team members can discuss the intended look together.')
  ]
};
// Different prompts from the section practice: comparisons are indicative, not a GCSE grade.
export const finalBank:PracticeQuestion[]=[
  q('final1','Mind maps','Which pair consists of mind-map components?',['Central node and branches','Start terminator and input symbol','Primary key and record','Slide transition and timeline'],'Nodes and branches organise ideas because connections show relationships.',mm),
  q('final2','Mind maps','What can make a mind map difficult to read?',['Too many crowded branches and long text','A clear central focus','Concise labels','Grouped ideas'],'Crowding reduces clarity because relationships become harder to follow.'),
  q('final3','Flowcharts','Which shape normally represents an action or calculation?',['Rectangle','Diamond','Oval','Parallelogram'],'A rectangle is the process symbol because it represents an operation.',fc),
  q('final4','Flowcharts','What should a flowchart show when a condition has two outcomes?',['Two clearly labelled outgoing routes','No outgoing route','Only a page title','Two unrelated central nodes'],'Labels clarify which route to follow because each outcome leads to a particular next step.'),
  q('final5','Wireframes','Why might a wireframe use plain boxes instead of finished graphics?',['To focus attention on structure','To encrypt the design','To calculate image resolution','To prevent any feedback'],'Plain boxes keep attention on structure because decorative details are not yet the priority.',wf),
  q('final6','Wireframes','Which term describes moving between screens?',['Navigation','Compression','Encryption','Compilation'],'Navigation describes movement because users follow links and controls between screens.'),
  q('final7','Visualisation','Which design tool uses a rough layout with notes specifying its appearance?',['Visualisation diagram','Flowchart','Reference mind map','Network diagram'],'The annotated layout plans appearance because notes specify visual details.',vd),
  q('final8','Visualisation','Why can editable text boxes help during design?',['Text can be repositioned without recreating the whole plan','They automatically test all buttons','They prevent every possible error','They always convert a design to program code'],'Editable objects help revision because individual elements can be moved and changed.',vd),
  q('final9','Mood boards','Which item communicates a proposed colour scheme?',['A set of colour swatches','A sequence of process symbols','A table of passwords','A CPU instruction'],'Colour swatches show a palette because they present the chosen colours together.'),
  q('final10','Choosing tools','Why might a designer use more than one design tool?',['Different tools plan different aspects of a product','Every tool performs exactly the same job','Using one tool prevents all other tools','More tools always guarantee a perfect product'],'Different tools serve different purposes because ideas, appearance and process logic need different representations.')
];
