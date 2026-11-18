import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('Incident Desk', () => {
  it('renders accessible page heading and incident form', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Incident Desk' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Create incident' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });
});
