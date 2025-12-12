import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders SRS Upload page by default', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Upload SRS/i)).toBeInTheDocument();
});

test('navigates to Test Cases route', () => {
  render(
    <MemoryRouter initialEntries={['/testcases']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Test Cases/i)).toBeInTheDocument();
});
