import { ArtifactData, CheckResult, ModuleId } from '../types';

export function validateLayout(data: ArtifactData, moduleId: Extract<ModuleId,'visualisation'|'wireframe'>): CheckResult[] {
  const kinds = data.nodes.map(n => String(n.data.kind ?? n.type));
  const labels = data.nodes.map(n => String(n.data.label ?? '')).filter(Boolean);
  const count = (k:string) => kinds.filter(x => x === k).length;
  const hasText = labels.some(x => x.trim().length > 2);
  if (moduleId === 'visualisation') return [
    {id:'content',label:'Content',status:hasText?'pass':'fail',message:hasText?'The design contains meaningful text.':'Add meaningful text showing the product content.'},
    {id:'image',label:'Images or graphics',status:count('image')>0?'pass':'fail',message:count('image')>0?'An image area is included.':'Add at least one image or graphic area.'},
    {id:'layout',label:'Layout',status:data.nodes.length>=5?'pass':'fail',message:data.nodes.length>=5?'Several elements show a planned layout.':'Add at least five elements to show the full layout.'},
    {id:'annotation',label:'Annotations',status:count('annotation')>=2?'pass':'fail',message:count('annotation')>=2?'Design choices are annotated.':'Add at least two annotations about size, position, font, colour or style.'},
    {id:'theme',label:'Visual theme',status:count('colour')>0?'pass':'warn',message:count('colour')>0?'A colour/theme swatch is shown.':'Add a colour or theme swatch to communicate the intended style.'},
  ];
  return [
    {id:'content',label:'Required content',status:hasText?'pass':'fail',message:hasText?'Elements have clear labels.':'Label each placeholder so its purpose is clear.'},
    {id:'structure',label:'Screen structure',status:data.nodes.length>=6?'pass':'fail',message:data.nodes.length>=6?'The screen has a developed layout.':'Add at least six screen elements.'},
    {id:'input',label:'Input fields',status:count('input')>=2?'pass':'fail',message:count('input')>=2?'Two or more input fields are planned.':'Add fields for appointment reference and date of birth.'},
    {id:'action',label:'Actions',status:count('button')>=2?'pass':'fail',message:count('button')>=2?'Primary and secondary actions are shown.':'Add at least two clearly labelled buttons.'},
    {id:'navigation',label:'Navigation or help',status:count('nav')>0?'pass':'warn',message:count('nav')>0?'Navigation/help is included.':'Add a Home, Back or Help control.'},
    {id:'image',label:'Image placeholder',status:count('image')>0?'pass':'warn',message:count('image')>0?'An image/logo area is planned.':'Consider adding a labelled logo or image placeholder.'},
  ];
}
export const layoutChecklistPassed = (r:CheckResult[]) => r.every(x => x.status !== 'fail');
