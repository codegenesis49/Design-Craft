// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Journey from '../components/Journey';

afterEach(cleanup);
beforeEach(()=>{localStorage.clear();window.scrollTo=vi.fn();});
describe('App smoke tests', () => {
  it('renders the dashboard with modules and upcoming cards', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    expect(screen.getByText('Mind Maps')).toBeTruthy();
    expect(screen.getByText('Flowcharts')).toBeTruthy();
    expect(screen.getByText('Visualisation Diagrams')).toBeTruthy();
    expect(screen.getByText('Wireframes')).toBeTruthy();
    expect(screen.getByText('Project editor available')).toBeTruthy();
    expect(screen.getByText(/hospital self-service appointment system/i)).toBeTruthy();
  });

  it('renders the mind-map lesson journey starting at Read and Learn', () => {
    render(<MemoryRouter><Journey moduleId="mindmap" /></MemoryRouter>);
    expect(screen.getAllByText('Read and Learn').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/organise and connect ideas around a central theme/i).length).toBeGreaterThan(0);
    // tabs switch
    fireEvent.click(screen.getByRole('tab', { name: /Disadvantages/ }));
    expect(screen.getByText(/Can become crowded/)).toBeTruthy();
    // continue unlocks the next step
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    expect(screen.getByText(/Quick check before you build/)).toBeTruthy();
  });

  it('renders the flowchart journey and its quick check gating', () => {
    render(<MemoryRouter><Journey moduleId="flowchart" /></MemoryRouter>);
    expect(screen.getByRole('tabpanel').textContent).toMatch(/steps, processing and decisions/i);

    fireEvent.click(screen.getByRole('tab', { name: /What is sequence/ }));
    expect(screen.getByRole('tabpanel').textContent).toMatch(/Sequence is the order in which instructions or actions happen/);
    expect(screen.getAllByLabelText(/Example sequence: Start/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('tab', { name: /Components/ }));
    expect(screen.getAllByLabelText('Flowchart symbols and their meanings').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Start / End').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Input / Output').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Decision labels').length).toBeGreaterThan(0);
  });
});
