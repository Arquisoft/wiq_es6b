// Import necessary dependencies
import { render, screen } from '@testing-library/react';
import Login from './Login';
import React from 'react';

// Define the test suite
describe('Login Component', () => {
  // Define the test
  test('renders login button', () => {
    // Render the Login component
    render(<Login setLogged={() => {}} />);

    // Check if the login button is in the document
    const loginButton = screen.getByText(/Iniciar sesión/i);
    expect(loginButton).toBeInTheDocument();
  });
});


/*import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';

const mockAxios = new MockAdapter(axios);

describe('Login component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should log in successfully', async () => {
    render(<Login setLogged={() => {}} />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });

    // Simulate user input
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(loginButton);
      });

    // Verify that the user information is displayed
    const welcomeMessage = await waitFor(() => screen.getByText(/Hola testUser!/i));
    expect(welcomeMessage).toBeInTheDocument();
    const accountCreationMessage = await waitFor(() => screen.getByText(/Tu cuenta fue creada el 1\/1\/2024/i));
    expect(accountCreationMessage).toBeInTheDocument();
  });

  
  it('should handle error when logging in', async () => {
    render(<Login setLogged={() => {}} />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/login').reply(401, { error: 'Unauthorized' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Unauthorized/i)).toBeInTheDocument();
    });

    // Verify that the user information is not displayed
    expect(screen.queryByText(/Hola testUser!/i)).toBeNull();
    expect(screen.queryByText(/Tu cuenta fue creada el/i)).toBeNull();
  });
});
*/