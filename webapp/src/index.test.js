import { render, screen } from '@testing-library/react';
import RootComponent from './index'; // Adjust this import as necessary

test('renders welcome message', () => {
  render(<RootComponent />);
  const welcomeElement = screen.getByText(/Bienvenido a Saber y Ganar/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders copyright message', () => {
  render(<RootComponent />);
  const copyrightElement = screen.getByText(/© wiq_6b/i);
  expect(copyrightElement).toBeInTheDocument();
});