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
    expect(screen.getByText('Visualisation Diagrams')).toBeTruthy();
    expect(screen.getByText('Wireframes')).toBeTruthy();
    expect(screen.getAllByText('Coming later').length).toBeGreaterThanOrEqual(1);
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

    fireEvent.click(screen.getByRole('tab', { name: /What is sequence/ }));
    expect(screen.getByText(/Sequence is the order in which instructions or actions happen/)).toBeTruthy();
    expect(screen.getByLabelText(/Example sequence: Start/)).toBeTruthy();

    fireEvent.click(screen.getByRole('tab', { name: /Components/ }));
    expect(screen.getByLabelText('Flowchart symbols and their meanings')).toBeTruthy();
    expect(screen.getByText('Start / End')).toBeTruthy();
    expect(screen.getByText('Input / Output')).toBeTruthy();
    expect(screen.getByText('Decision labels')).toBeTruthy();
  });
});
