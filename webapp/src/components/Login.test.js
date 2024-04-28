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

    // Mock para la petición POST de login exitosa
    axios.post.mockResolvedValueOnce({
      data: {
        createdAt: new Date().toISOString()
      }
    });

    // Mock para la petición GET de obtener todos los usuarios
    axios.get.mockResolvedValueOnce({
      data: [] // Puedes ajustar esto según lo que necesites en tu test
    });

    // Mock para la petición POST de createUserRank exitosa
    axios.post.mockResolvedValueOnce({
      data: {} // Puedes ajustar esto según lo que necesites en tu test
    });

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

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'normalUser' } });
      fireEvent.change(passwordInput, { target: { value: 'test123' } });

      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(setLogged).toHaveBeenCalledTimes(1);

      expect(screen.getByText(/Jugar/i)).toBeInTheDocument();
      expect(screen.getByText(/Historial de jugadas/i)).toBeInTheDocument();
      expect(screen.getByText(/Ranking/i)).toBeInTheDocument();
      expect(screen.getByText(/Ajustes de partida/i)).toBeInTheDocument();

      expect(screen.getByText(/Hola testUser!/i)).toBeInTheDocument();
      expect(screen.getByText(/Tu cuenta fue creada el/i)).toBeInTheDocument();
      expect(screen.getByText(/Comenzar a jugar/i)).toBeInTheDocument();
    });
  });

  test('login with valid admin credentials', async () => {
    const setLogged = jest.fn();

    // Mock para la petición POST de login exitosa
    axios.post.mockResolvedValueOnce({
      data: {
        createdAt: new Date().toISOString()
      }
    });

    // Mock para la petición GET de obtener todos los usuarios
    axios.get.mockResolvedValueOnce({
      data: [] // Puedes ajustar esto según lo que necesites en tu test
    });

    // Mock para la petición POST de createUserRank exitosa
    axios.post.mockResolvedValueOnce({
      data: {} // Puedes ajustar esto según lo que necesites en tu test
    });
    
    await act(async () => {
      render(<Login setLogged={setLogged}/>);
    });

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(setLogged).toHaveBeenCalledTimes(1);
      
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

  test('login fails on post /login and error is handled ', async () => {
    const setLogged = jest.fn();

    // Mock para la petición POST de login fallada
    axios.post.mockRejectedValueOnce({ response: { status: 500, data: { error: 'Internal Server Error' } } });

    await act(async () => {
      render(<Login setLogged={setLogged}/>);
    });
  
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } });
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(setLogged).toHaveBeenCalled(0);
      expect(screen.getByText(/Internal Server Error/i)).toBeInTheDocument();
      expect(screen.queryByText(/Comenzar a jugar/i)).not.toBeInTheDocument();
    });
  });

  test('login fails on get /getAllUsers and error is handled ', async () => {
    const setLogged = jest.fn();

    // Mock para la petición POST de login exitosa
    axios.post.mockResolvedValueOnce({
      data: {
        createdAt: new Date().toISOString()
      }
    });
    // Mock para la petición get de login fallada
    axios.get.mockRejectedValueOnce({ response: { status: 500} });

    await act(async () => {
      render(<Login setLogged={setLogged}/>);
    });
  
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } });
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(setLogged).toHaveBeenCalled(0);
      expect(screen.getByText(/Error interno del servidor/i)).toBeInTheDocument();
      expect(screen.queryByText(/Comenzar a jugar/i)).not.toBeInTheDocument();
    });
  });

  test('login fails on post /createUserRank and error is handled ', async () => {
    const setLogged = jest.fn();

    // Mock para la petición POST de login exitosa
    axios.post.mockResolvedValueOnce({
      data: {
        createdAt: new Date().toISOString()
      }
    });

    // Mock para la petición GET de obtener todos los usuarios
    axios.get.mockResolvedValueOnce({
      data: [] // Puedes ajustar esto según lo que necesites en tu test
    });

    // Mock para la petición POST de login fallada
    axios.post.mockRejectedValueOnce({ response: { status: 500} });

    await act(async () => {
      render(<Login setLogged={setLogged}/>);
    });
  
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } });
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(setLogged).toHaveBeenCalled(0);
      expect(screen.getByText(/Error interno del servidor/i)).toBeInTheDocument();
      expect(screen.queryByText(/Comenzar a jugar/i)).not.toBeInTheDocument();
    });
  });
});
