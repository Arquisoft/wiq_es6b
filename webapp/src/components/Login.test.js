// Import necessary dependencies
import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

jest.mock('axios');

const mockAxios = new MockAdapter(axios);

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

  test('login with valid normal (not "admin") credentials', async () => {
    const setLogged = jest.fn();

    await act(async () => {
      render(<Login setLogged={setLogged}/>);
    });

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });
    // Verificar que los elementos están presentes
    expect(loginButton).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // Mock the axios.post & axios.get requests to simulate successful responses
    mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });
    mockAxios.onGet('http://localhost:8000/getAllUsers').reply(200, []);
    mockAxios.onPost('http://localhost:8000/createUserRank').reply(200);

    await act(async () => {
      // Simulate user input
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin' } });

      // Trigger the add user button click
      fireEvent.click(loginButton);
    });

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(setLogged).toHaveBeenCalledTimes(0);

      expect(screen.getByText(/Jugar/i)).toBeInTheDocument();
      expect(screen.getByText(/Historial de jugadas/i)).toBeInTheDocument();
      expect(screen.getByText(/Ranking/i)).toBeInTheDocument();
      expect(screen.getByText(/Ajustes de partida/i)).toBeInTheDocument();

      expect(screen.getByText(/Hola testUser!/i)).toBeInTheDocument();
      expect(screen.getByText(/Tu cuenta fue creada el/i)).toBeInTheDocument();
      expect(screen.getByText(/Comenzar a jugar/i)).toBeInTheDocument();
    });
  });

  /*
  test('login with valid admin credentials', async () => {
    await act(async () => {
      const setLogged = jest.fn();
      render(<Login setLogged={setLogged}/>);

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });

      // Mock the axios.post & axios.get requests to simulate successful responses
      mockAxios.onPost('http://localhost:8000/login').reply(200);
      mockAxios.onGet('http://localhost:8000/getAllUsers').reply(200);
      mockAxios.onPost('http://localhost:8000/createUserRank').reply(200);
      mockAxios.onGet('http://localhost:8000/actRanking').reply(200);
      mockAxios.onPost('http://localhost:8000/updateAllRanking').reply(200);


      // Simulate user input
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

      // Trigger the add user button click
      fireEvent.click(loginButton);

      // Wait for the Snackbar to be open
      await waitFor(() => {
        expect(setLogged).toHaveBeenCalledTimes(0);
        
        expect(screen.getByText(/Jugar/i)).toBeInTheDocument();
        // only for admin
        expect(screen.getByText(/Historial de Usuarios/i)).toBeInTheDocument();
        expect(screen.getByText(/Historial de Preguntas Generadas/i)).toBeInTheDocument();
        // end only for admin
        expect(screen.getByText(/Historial de jugadas/i)).toBeInTheDocument();
        expect(screen.getByText(/Ranking/i)).toBeInTheDocument();
        expect(screen.getByText(/Ajustes de partida/i)).toBeInTheDocument();

        expect(screen.getByText(/Hola testUser!/i)).toBeInTheDocument();
        expect(screen.getByText(/Tu cuenta fue creada el/i)).toBeInTheDocument();
        expect(screen.getByText(/Comenzar a jugar/i)).toBeInTheDocument();
      });
    });
  });

  test('login fails on post /login and error is handled ', async () => {
    await act(async () => {
      const setLogged = jest.fn();
      render(<Login setLogged={setLogged}/>);

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });

      // Mock the axios.post & axios.get requests to simulate successful responses
      mockAxios.onPost('http://localhost:8000/login').reply(500);

      // Simulate user input
      fireEvent.change(usernameInput, { target: { value: 'testUser' } });
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

      // Trigger the add user button click
      fireEvent.click(loginButton);

      // Wait for the Snackbar to be open
      await waitFor(() => {
        expect(setLogged).toHaveBeenCalled();
        expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
      });
    });
  });
  */
});
