import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AttemptResult } from '../types';
import { prepareQuiz, scoreQuiz } from '../logic/quiz';
import { finalBank, PracticeQuestion, practiceBanks } from '../content/examPractice';
import { ProjectTool, toolNames, downloadJSON } from '../data/projects';
import { GlossaryText } from './Glossary';
interface Progress { version:1; draft:Record<string,string>; attempts:AttemptResult[]; reviewing:boolean; }
export function ExamPractice({tool,final=false}:{tool:ProjectTool;final?:boolean}) {
  const key=`designcraft.practice.v1.${final?'final':tool}`;
  const [error,setError]=useState('');
  const [corrupt,setCorrupt]=useState(false);
  const [progress,setProgress]=useState<Progress>(()=>{try{const raw=localStorage.getItem(key);if(!raw)return {version:1,draft:{},attempts:[],reviewing:false};const p=JSON.parse(raw);if(p.version!==1||!p.draft||!Array.isArray(p.attempts))throw Error();return p;}catch{setCorrupt(true);return {version:1,draft:{},attempts:[],reviewing:false};}});
  const bank:PracticeQuestion[]=final?finalBank:practiceBanks[tool];
  const questions=useMemo(()=>prepareQuiz(bank,2300+progress.attempts.length),[bank,progress.attempts.length]);
  const complete=bank.every(q=>q.options.includes(progress.draft[q.id]));
  const latest=progress.attempts[progress.attempts.length-1];
  const review=progress.reviewing&&latest;
  function save(next:Progress){setProgress(next);if(corrupt){setError('An older result could not be read. It has not been overwritten. Download this attempt to keep it.');return;}try{localStorage.setItem(key,JSON.stringify(next));setError('');}catch{setError('Results are only in this open page: browser storage is unavailable or full. Download them before leaving.');}}
  return <section className="exam-practice card card-pad"><div className="eyebrow">{final?'End-of-module assessment':'R050 exam-style practice'}</div><h2>{final?'Design tools: final check':`${toolNames[tool]}: five MCQs`}</h2><p className="small muted">Direct questions, no scenarios. Original MCQ adaptations of the supplied OCR R050 papers, with supplementary practice where needed. Not an official OCR paper or grade.</p>
    {(error||corrupt)&&<p role="alert" className="feedback bad">{error||'Existing practice data could not be read. It is being preserved.'}</p>}
    {review?<><p className="note"><strong>Latest: {latest.score}/{latest.total}</strong> · First: {progress.attempts[0].score}/{progress.attempts[0].total} · Attempts: {progress.attempts.length}</p>{bank.map(q=><div className="review-q" key={q.id}><strong>{q.prompt}</strong><p>Your answer: {latest.answers[q.id] || 'No answer'} · {latest.answers[q.id]===q.options[q.answer]?'Correct':'Incorrect'}</p><p>Correct answer: {q.options[q.answer]}</p><p><GlossaryText text={q.explanation}/></p><small className="muted">{q.source}</small></div>)}<Link className="btn btn-secondary" to={`/resources?tool=${tool}`}>Review visual examples</Link><button className="btn btn-primary" onClick={()=>save({...progress,draft:{},reviewing:false})}>Try again</button></>:<><p>{bank.length} questions. Answers are revealed after submission. Your selections save on this browser.</p>{questions.map((q,i)=><fieldset className="practice-question" key={q.id}><legend>{i+1}. {q.prompt}</legend>{q.shuffledOptions.map(o=><label key={o} className={`option-row ${progress.draft[q.id]===o?'selected':''}`}><input type="radio" name={`${key}-${q.id}`} checked={progress.draft[q.id]===o} onChange={()=>save({...progress,draft:{...progress.draft,[q.id]:o}})}/>{o}</label>)}</fieldset>)}<button className="btn btn-primary" disabled={!complete} onClick={()=>save({...progress,attempts:[...progress.attempts,scoreQuiz(bank,progress.draft)],reviewing:true})}>Submit MCQs</button></>}
    {progress.attempts.length>0&&<details className="read-more"><summary>Attempt history</summary><ol>{progress.attempts.map((a,i)=><li key={`${a.at}-${i}`}>{new Date(a.at).toLocaleString('en-GB')} — {a.score}/{a.total}</li>)}</ol></details>}
    <button className="btn btn-ghost" onClick={()=>downloadJSON({format:'designcraft-practice-results',tool:final?'final':tool,...progress},`DesignCraft-${final?'final':tool}-results.json`)}>Download results and selections</button>
  </section>;
}
export default function AssessmentPage(){return <div className="page"><ExamPractice tool="mindmap" final/></div>;}
