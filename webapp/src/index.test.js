import { render, screen } from '@testing-library/react';
import RootComponent from './index'; // Adjust this import as necessary

describe('RootComponent', () => {
  beforeEach(() => {
    render(<RootComponent />);
  });

  it('renders welcome message', () => {
    const welcomeElement = screen.getByText(/Bienvenido a Saber y Ganar/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  it('renders copyright message', () => {
    const copyrightElement = screen.getByText(/© wiq_6b/i);
    expect(copyrightElement).toBeInTheDocument();
  });

  // Add more tests as necessary
});