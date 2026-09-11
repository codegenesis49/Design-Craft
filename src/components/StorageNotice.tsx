import { useEffect, useState } from 'react';
import { downloadJSON } from '../data/projects';
import { dataService } from '../data/dataService';
export default function StorageNotice(){const [warning,setWarning]=useState('');useEffect(()=>{const h=(e:Event)=>setWarning((e as CustomEvent<string>).detail);window.addEventListener('designcraft-storage-warning',h);return()=>window.removeEventListener('designcraft-storage-warning',h);},[]);if(!warning)return null;return <div className="feedback bad storage-notice" role="alert">{warning}<button className="btn btn-secondary" onClick={()=>downloadJSON({format:'designcraft-lesson-recovery',version:1,records:dataService.listAll()},'DesignCraft-lesson-recovery.json')}>Download open lesson records</button></div>;}
