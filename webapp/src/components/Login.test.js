// Import necessary dependencies
import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './Login';

// Define the test suite
describe('Login Component', () => {
  // Define the test
  test('renders login button', () => {
    // Render the Login component
    render(<Login setLogged={() => {}} />);

    // Check if the login button is in the document
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });
    expect(loginButton).toBeInTheDocument();
  });
});
