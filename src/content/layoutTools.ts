import { LearnTab, QuickQuestion } from './mindmap';
import { QuizQuestion } from '../types';

export const visualisationLearnTabs: LearnTab[] = [
  { id:'definition', title:'Definition', blocks:[
    { text:'A visualisation diagram is a rough drawing that shows what a finished static product could look like.' },
    { note:'Static means it does not change over time. Examples include a poster, leaflet, report page or dashboard layout.' },
  ]},
  { id:'purpose', title:'When to use it', blocks:[
    { text:'Use it to plan the appearance and layout of a product before making the real version.' },
    { bullets:['Plan a poster, leaflet or report page','Show where text and images will go','Try colours, fonts and a visual theme','Annotate sizes, styles and positions'] },
    { note:'Do not use it to show a process or a product with a timeline. Use a flowchart for steps and decisions.' },
  ]},
  { id:'components', title:'What to include', blocks:[
    { bullets:['Images or graphics','The size and position of images','The position and style of text','Fonts','Colours and a theme','Labels or annotations explaining design choices'] },
  ]},
  { id:'software', title:'Suitable software', blocks:[
    { bullets:['Desktop-publishing (DTP) software — combines and positions text and images precisely','Presentation software — arranges text, shapes and graphics on a slide','Drawing or image-editing software — creates detailed sketches and graphics'] },
  ]},
  { id:'advantages', title:'Advantages', blocks:[
    { bullets:['Simple to produce','Non-technical, so most people can understand it','Shows ideas and document layout clearly','Lets you check whether the layout works before building the product'] },
  ]},
  { id:'disadvantages', title:'Disadvantages', blocks:[
    { bullets:['May lack detail','Missing technical information can cause confusion','Does not show interaction or a timeline','A rough sketch may be interpreted differently by different people'] },
  ]},
  { id:'comparison', title:'Compared with other tools', blocks:[
    { bullets:['Visualisation diagram: shows how a static product could look','Wireframe: plans what a screen contains and where elements go','Flowchart: shows steps, decisions and routes','Mind map: organises and connects ideas'] },
  ]},
];

export const wireframeLearnTabs: LearnTab[] = [
  { id:'definition', title:'Definition', blocks:[
    { text:'A wireframe is a plan showing what a screen will contain and where each element will go.' },
    { note:'It focuses first on what the product will do and how the layout works, before detailed design begins.' },
  ]},
  { id:'purpose', title:'When to use it', blocks:[
    { bullets:['Plan a website, app or kiosk screen','Position headings, buttons, fields, images and navigation','Check that all required elements are included','Change the layout quickly before development'] },
  ]},
  { id:'components', title:'Low fidelity', blocks:[
    { text:'A low-fidelity wireframe is a simple first draft, usually in greyscale.' },
    { bullets:['Boxes','Clear box labels','Image placeholders','A layout grid','Basic placeholders for interactive elements'] },
    { note:'Use meaningful labels such as “Appointment reference field” rather than dummy lorem ipsum text.' },
  ]},
  { id:'high', title:'High fidelity', blocks:[
    { text:'A high-fidelity wireframe shows more realistic detail and may demonstrate interaction.' },
    { bullets:['Branding or a logo','Colours','Fonts','Realistic text and images','Interactive behaviour such as a drop-down list'] },
  ]},
  { id:'software', title:'Suitable software', blocks:[
    { bullets:['Word-processing software — basic shapes and lines for low-fidelity wireframes','DTP software — precise positioning and grouping for high-fidelity wireframes','Presentation or specialist prototyping software — detailed screens and interactions'] },
  ]},
  { id:'advantages', title:'Advantages', blocks:[
    { bullets:['Elements can be moved and resized easily','Layout can be finalised without visual clutter','Changes can be made efficiently','High-fidelity versions can support testing'] },
  ]},
  { id:'disadvantages', title:'Disadvantages', blocks:[
    { bullets:['Low-fidelity wireframes cannot fully show interactive features','High-fidelity wireframes can become over-designed','A wireframe does not show process logic','Basic placeholders may be misunderstood without labels'] },
  ]},
];

export const visualisationQuickCheck: QuickQuestion[] = [
  {id:'vqc1',prompt:'What does a visualisation diagram show?',options:['How a static final product could look','The exact code','A process with decisions','A network connection'],answer:0,feedback:'It shows the proposed appearance and layout of a static product.'},
  {id:'vqc2',prompt:'Which product is most suitable?',options:['A poster','A login decision process','A program algorithm','A changing video timeline'],answer:0,feedback:'A poster is static, so its layout can be planned visually.'},
  {id:'vqc3',prompt:'Which should be annotated?',options:['Text and image sizes or styles','Passwords','Source code only','IP addresses'],answer:0,feedback:'Annotations explain design choices such as sizes, positions, fonts and styles.'},
  {id:'vqc4',prompt:'Which software is suitable?',options:['DTP software','Antivirus only','Database server only','Operating system only'],answer:0,feedback:'DTP software combines and positions text and images precisely.'},
];
export const wireframeQuickCheck: QuickQuestion[] = [
  {id:'wqc1',prompt:'What does a wireframe mainly plan?',options:['Screen content and layout','Malware removal','Network traffic','Program source code'],answer:0,feedback:'A wireframe plans what a screen contains and where elements go.'},
  {id:'wqc2',prompt:'Which belongs in a low-fidelity wireframe?',options:['Labelled boxes and image placeholders','Finished photography only','Database records','Flowchart diamonds'],answer:0,feedback:'Low fidelity uses simple labelled boxes and placeholders.'},
  {id:'wqc3',prompt:'Which is added in high fidelity?',options:['Branding, colours and realistic text','Only blank boxes','Decision routes','Network cables'],answer:0,feedback:'High fidelity adds realistic visual detail and may show interaction.'},
  {id:'wqc4',prompt:'Why use a wireframe before development?',options:['To change layout quickly','To encrypt data','To compile code','To replace testing'],answer:0,feedback:'It is quicker and cheaper to change a plan than a finished product.'},
];

const q = (id:string, topic:string, prompt:string, options:string[], answer:number, reason:string): QuizQuestion =>
  ({id,topic,prompt,options,answer,explanation:`${options[answer]} is correct because ${reason}`});
export const visualisationQuiz: QuizQuestion[] = [
  q('v1','Definition','A visualisation diagram is…',['a rough drawing of how a static final product could look','a coded prototype','a network map','a process algorithm'],0,'it plans appearance and layout before production.'),
  q('v2','Purpose','Which is the best use?',['Planning a leaflet page','Showing Yes/No routes','Writing source code','Scheduling a video'],0,'a leaflet is a static product whose layout can be sketched.'),
  q('v3','Components','Which is a component?',['Position and style of text','A decision diamond','A database key','A loop counter'],0,'the diagram communicates visual layout and styling.'),
  q('v4','Annotations','What should an annotation explain?',['The intended font size or image position','A password','The CPU clock speed only','A Boolean operator'],0,'annotations make design intentions clear.'),
  q('v5','Software','Which software is suitable?',['DTP software','Antivirus software','Backup software','A compiler only'],0,'DTP combines and precisely positions text and graphics.'),
  q('v6','Advantages','Which is an advantage?',['Most people can understand the non-technical sketch','It always contains full technical detail','It runs the finished system','It shows every interaction'],0,'a visual sketch communicates ideas clearly to clients.'),
  q('v7','Disadvantages','Which is a disadvantage?',['It can lack technical detail','It clearly shows layout','It is simple to produce','It can show design ideas'],0,'missing details can cause confusion or misinterpretation.'),
  q('v8','Suitability','Which product is unsuitable?',['An animation with a timeline','A poster','A report page','A leaflet'],0,'a single static sketch cannot represent changes over time.'),
  q('v9','Comparison','To plan button positions on a kiosk, first use…',['a wireframe','a flowchart','a mind map only','a network diagram'],0,'a wireframe focuses on screen elements and layout.'),
  q('v10','Comparison','To show accepted and rejected routes, use…',['a flowchart','a visualisation diagram','a mood board','a poster'],0,'a flowchart represents decisions and alternative routes.'),
];
export const wireframeQuiz: QuizQuestion[] = [
  q('w1','Definition','A wireframe is…',['a plan of screen content and layout','a finished database','a network protocol','a malware scan'],0,'it outlines the screen before detailed design and development.'),
  q('w2','Purpose','Why create one early?',['To change layout quickly','To encrypt files','To replace all testing','To execute code'],0,'moving placeholders is faster than rebuilding a finished product.'),
  q('w3','Low fidelity','Which is low fidelity?',['Greyscale labelled boxes and image placeholders','Finished branding and photographs','Working database queries','A decision flow'],0,'low fidelity is a simple structural first draft.'),
  q('w4','Low fidelity','Which is a component?',['Layout grid','Decision diamond','Central node','Timeline keyframe'],0,'a grid helps align and position interface elements.'),
  q('w5','High fidelity','What makes a wireframe high fidelity?',['Realistic text, colours, branding and possible interaction','Only blank boxes','No labels','Only handwritten notes'],0,'high fidelity adds realistic visual and functional detail.'),
  q('w6','Software','Which suits a basic low-fidelity wireframe?',['Word-processing software','Antivirus software','Backup utility','Firewall only'],0,'built-in shapes and lines can create a simple layout.'),
  q('w7','Advantages','Which is an advantage?',['Elements can be moved and resized efficiently','It automatically writes the application','It guarantees usability','It replaces a flowchart'],0,'the layout can be improved before costly development.'),
  q('w8','Disadvantages','Which is a low-fidelity limitation?',['It cannot fully show interactive behaviour','It is always over-designed','It contains too many colours','It executes code'],0,'static placeholders do not demonstrate full interaction.'),
  q('w9','Comparison','To show what happens after invalid input, use…',['a flowchart','a wireframe only','a mood board','a poster'],0,'a flowchart shows decisions, routes and error handling.'),
  q('w10','Suitability','What should a kiosk wireframe include?',['Clearly labelled fields, buttons, navigation and content areas','Only colour swatches','Only process arrows','Only hardware parts'],0,'these are the visible interface elements users need.'),
];
