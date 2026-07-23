// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Journey from '../components/Journey';

describe('App smoke tests', () => {
  it('renders the dashboard with modules and upcoming cards', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    expect(screen.getByText('Mind Maps')).toBeTruthy();
    expect(screen.getByText('Flowcharts')).toBeTruthy();
    expect(screen.getAllByText('Coming later').length).toBeGreaterThanOrEqual(3);
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
    expect(screen.getByText(/steps, processing and decisions/i)).toBeTruthy();
  });
});
