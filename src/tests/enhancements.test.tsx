// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Projects from '../components/Projects';
import { ExamPractice } from '../components/ExamPractice';
import { practiceBanks } from '../content/examPractice';
import WordBank, { GlossaryText } from '../components/Glossary';
import ResourcesPage from '../components/LearningResources';
afterEach(cleanup);
beforeEach(()=>localStorage.clear());
describe('Learning enhancements',()=>{
  it('creates a named mood-board project through My Projects',()=>{
    render(<MemoryRouter><Projects/></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Project name'),{target:{value:'My sports theme'}});fireEvent.change(screen.getByLabelText('Design tool'),{target:{value:'moodboard'}});fireEvent.click(screen.getByRole('button',{name:'Create project'}));
    expect(screen.getByRole('heading',{name:'My sports theme'})).toBeTruthy();expect(screen.getByRole('link',{name:'Open'}).getAttribute('href')).toMatch(/^\/projects\//);
  });
  it('opens glossary definitions by keyboard focus and closes with Escape',()=>{
    render(<GlossaryText text="Add an annotation to explain the layout."/>);const term=screen.getByRole('button',{name:'annotation'});fireEvent.focus(term);expect(screen.getByRole('tooltip').textContent).toContain('A note explaining');fireEvent.keyDown(term,{key:'Escape'});expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('searches the word bank',()=>{
    render(<WordBank/>);fireEvent.change(screen.getByLabelText('Find a word'),{target:{value:'terminator'}});expect(screen.getByText('terminator')).toBeTruthy();expect(screen.queryByText('navigation')).toBeNull();
  });
  it('opens the requested tool resource and its practice bank',()=>{
    render(<MemoryRouter initialEntries={['/resources?tool=moodboard']}><ResourcesPage/></MemoryRouter>);expect((screen.getByLabelText('Design tool') as HTMLSelectElement).value).toBe('moodboard');expect(screen.getByRole('heading',{name:'Mood board: five MCQs'})).toBeTruthy();
  });
  it('preserves practice selections after remount and stores first and retry separately',()=>{
    const mount=()=>render(<MemoryRouter><ExamPractice tool="mindmap"/></MemoryRouter>);const first=mount();const bank=practiceBanks.mindmap;
    fireEvent.click(screen.getByLabelText(bank[0].options[bank[0].answer]));first.unmount();mount();expect((screen.getByLabelText(bank[0].options[bank[0].answer]) as HTMLInputElement).checked).toBe(true);
    for(const q of bank.slice(1))fireEvent.click(screen.getByLabelText(q.options[q.answer]));fireEvent.click(screen.getByRole('button',{name:'Submit MCQs'}));expect(screen.getByText('Latest: 5/5')).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'Try again'}));
    for(const q of bank)fireEvent.click(screen.getByLabelText(q.options[1]));fireEvent.click(screen.getByRole('button',{name:'Submit MCQs'}));const saved=JSON.parse(localStorage.getItem('designcraft.practice.v1.mindmap')!);expect(saved.attempts.map((a:any)=>a.score)).toEqual([5,0]);
  });
});
