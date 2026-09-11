import { Children, cloneElement, isValidElement, ReactNode, useId, useState } from 'react';

export const glossary: Record<string,[string,string]> = {
  'mind map':['A diagram organising related ideas around a central focus.','A school-club map with branches for activities, members and equipment.'],
  'flowchart':['A diagram showing the order of actions and decisions in a process.','A decision splits a route into Yes and No paths.'],
  'wireframe':['A plan showing the structure, layout and possible navigation of a page or screen.','Boxes mark positions for a heading, image and button.'],
  'visualisation diagram':['An annotated plan of how a finished static product should look.','A flyer plan specifies the heading colour, image position and font size.'],
  'mood board':['A collection of visual inspiration that communicates a proposed theme or style.','Colours, typefaces, images and keywords for a sports campaign.'],
  'annotation':['A note explaining a detail on a design.','“Use 24-point blue text” beside a heading.'],
  'layout':['The arrangement of elements on a page or screen.','A heading at the top and two text columns below.'],
  'navigation':['How users move between pages, screens or sections.','A Home button returns to the main screen.'],
  'central focus':['The main topic or purpose at the centre of a mind map.','“School festival” is the topic all branches relate to.'],
  'central node':['The shape containing the main idea in a mind map.','A centre circle labelled “Lost and found app”.'],
  'main node':['A major idea connected to the central node.','“Report an item” is a main category.'],
  'sub-node':['A more detailed idea connected to a larger idea.','“Item colour” connects to “Item details”.'],
  'branch':['A connection from one idea to a related idea.','A line joins “Activities” to “Music”.'],
  'keyword':['A short, important word or phrase that captures an idea.','“Opening times”, instead of a long paragraph.'],
  'target audience':['The people a product is intended for.','Year 7 pupils using a school induction leaflet.'],
  'purpose':['What a product or design is intended to achieve.','A flyer may encourage people to attend an event.'],
  'placeholder':['A temporary marker reserving space for content.','A crossed box shows where an image will go.'],
  'interactivity':['Features that respond to a user’s actions.','A button opens another screen.'],
  'sequence':['The order in which actions or instructions happen.','Enter details, check details, then submit.'],
  'decision':['A test or question that determines which route to follow.','“Is the password correct?” has Yes and No routes.'],
  'process':['An action or operation in a flowchart.','Calculate the total price.'],
  'input':['Data entered into a system.','A user types a booking reference.'],
  'output':['Information produced by a system.','A confirmation message appears.'],
  'terminator':['A flowchart symbol marking the start or end.','An oval labelled Start.'],
  'flow line':['An arrow showing the direction between flowchart steps.','The arrow goes from input to decision.'],
  'typography':['The choice and arrangement of typefaces and text.','A bold heading and a readable body font.'],
  'font':['A particular text style used to display words.','A bold sans-serif heading.'],
  'accessibility':['Designing so people with different needs can use a product.','Readable contrast and clear labels help more users.'],
  'DTP':['Desktop publishing software used to arrange text and images on pages.','Aligning images and text boxes for a leaflet.'],
  'leaflet':['An information document, often folded into sections.','A folded guide to school clubs.'],
  'flyer':['A short promotional sheet, often a single unfolded page.','A one-page invitation to an open evening.'],
  'poster':['A display designed to communicate a message at a glance.','A large school-event notice on a wall.'],
};
const keys=Object.keys(glossary).sort((a,b)=>b.length-a.length);
const pattern=new RegExp(`\\b(${keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})(es|s)?\\b`,'gi');
function Term({term,label}:{term:string;label:string}) {
  const [open,setOpen]=useState(false); const id=useId();
  return <span className="glossary-term" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}><button type="button" className="term-button" aria-expanded={open} aria-describedby={open?id:undefined} onFocus={()=>setOpen(true)} onBlur={()=>setOpen(false)} onClick={()=>setOpen(true)} onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}}>{label}</button>{open&&<span className="term-tip" role="tooltip" id={id}><strong>{term}</strong><span>{glossary[term][0]}</span><em>Example: {glossary[term][1]}</em></span>}</span>;
}
export function GlossaryText({text}:{text:string}) {
  const pieces:ReactNode[]=[];let last=0;const re=new RegExp(pattern);
  for(const match of text.matchAll(re)){pieces.push(text.slice(last,match.index));const term=match[1].toLowerCase();const key=keys.find(k=>k.toLowerCase()===term)!;pieces.push(<Term key={`${match.index}-${key}`} term={key} label={match[0]}/>);last=match.index!+match[0].length;}
  pieces.push(text.slice(last));return <>{pieces}</>;
}
export function GlossaryContent({children}:{children:ReactNode}) {
  function walk(node:ReactNode):ReactNode {
    if(typeof node==='string')return <GlossaryText text={node}/>;
    if(!isValidElement<{children?:ReactNode}>(node))return node;
    if(typeof node.type!=='string' || ['button','a','input','textarea','select','svg','label','summary','h1','h2'].includes(node.type))return node;
    return cloneElement(node,{},Children.map(node.props.children,walk));
  }
  return <>{Children.map(children,walk)}</>;
}
export default function WordBank(){const [search,setSearch]=useState('');return <div className="page"><h1>Word bank</h1><p>Look up the vocabulary used in DesignCraft. Underlined words in learning explanations open these definitions.</p><label>Find a word<input className="text-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="e.g. annotation"/></label><dl className="glossary-list">{Object.entries(glossary).filter(([k,v])=>(k+' '+v.join(' ')).toLowerCase().includes(search.toLowerCase())).map(([k,[meaning,example]])=><div className="card card-pad" key={k}><dt><strong>{k}</strong></dt><dd>{meaning}<p className="muted">Example: {example}</p></dd></div>)}</dl>{!Object.entries(glossary).some(([k,v])=>(k+' '+v.join(' ')).toLowerCase().includes(search.toLowerCase()))&&<p>No matching words. Try a shorter search.</p>}</div>;}
