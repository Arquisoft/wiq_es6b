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

  function setupMocksSuccess() {
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
  
    return setLogged;
  }

  test('login with valid normal (not "admin") credentials', async () => {
    const setLogged = setupMocksSuccess();
    
    await act(async () => {
      render(<Login setLogged={setLogged}/>);
    });

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } });
      fireEvent.change(passwordInput, { target: { value: 'test123' } });

      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(setLogged).toHaveBeenCalledTimes(1);

      expect(screen.getAllByText(/Jugar/i)).toHaveLength(2);
      expect(screen.getByText(/Historial de jugadas/i)).toBeInTheDocument();
      expect(screen.getByText(/Ranking/i)).toBeInTheDocument();
      expect(screen.getByText(/Ajustes de partida/i)).toBeInTheDocument();

      expect(screen.getByText(/Hola testUser!/i)).toBeInTheDocument();
      expect(screen.getByText(/Tu cuenta fue creada el/i)).toBeInTheDocument();
      expect(screen.getByText(/Comenzar a jugar/i)).toBeInTheDocument();
    });
  });

  test('login with valid admin credentials', async () => {
    const setLogged = setupMocksSuccess();    
    
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
      
      expect(screen.getAllByText(/Jugar/i)).toHaveLength(2);
      // only for admin
      expect(screen.getByText(/Historial de Usuarios/i)).toBeInTheDocument();
      expect(screen.getByText(/Historial de Preguntas Generadas/i)).toBeInTheDocument();
      // end only for admin
      expect(screen.getByText(/Historial de jugadas/i)).toBeInTheDocument();
      expect(screen.getByText(/Ranking/i)).toBeInTheDocument();
      expect(screen.getByText(/Ajustes de partida/i)).toBeInTheDocument();

      expect(screen.getByText(/Hola admin!/i)).toBeInTheDocument();
      expect(screen.getByText(/Tu cuenta fue creada el/i)).toBeInTheDocument();
      expect(screen.getByText(/Comenzar a jugar/i)).toBeInTheDocument();
    });
  });

  describe('sucessful login cases trying to access to: userList, questionList, recordList, rankingList, settings', () => {
    beforeEach(async () => {
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
    });

    test('from login try to access to usersList', async () => {
      const usersListTab = screen.getByText(/Historial de Usuarios/i);
      await act(async () => {
        fireEvent.click(usersListTab);
      });
      await waitFor(() => {
        expect(screen.getByText(/Nombre de Usuario/i)).toBeInTheDocument();
        expect(screen.getByText(/Fecha de Registro/i)).toBeInTheDocument();
      });
    });
/*
    test('from login try to access to generatedQuestionsList', async () => {
    
    });

    test('from login try to access to recordList', async () => {
    
    });

    test('from login try to access to rankingList', async () => {
    
    });

    test('from login try to access to gameSettings', async () => {
    
    });
*/
  });

  async function performLoginFail(setLogged, username = 'testUser', password = 'testPassword', error = 'Internal Server Error', loggedIn = false) {
    await act(async () => {
      render(<Login setLogged={setLogged}/>);
    });
  
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i });
  
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: username } });
      fireEvent.change(passwordInput, { target: { value: password } });
  
      fireEvent.click(loginButton);
    });
  
    await waitFor(() => {
      if (!loggedIn) {
      expect(setLogged).not.toHaveBeenCalled();
      } else {
        expect(setLogged).toHaveBeenCalled();
      }
      expect(screen.getByText(new RegExp(error, 'i'))).toBeInTheDocument();
      expect(screen.queryByText(/Comenzar a jugar/i)).not.toBeInTheDocument();
    });
  }

  test('login fails on post /login and error is handled ', async () => {
    const setLogged = jest.fn();

    // Mock para la petición POST de login fallada
    axios.post.mockRejectedValueOnce({ response: { status: 500, data: { error: 'Internal Server Error' } } });

    await performLoginFail(setLogged);
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
    axios.get.mockRejectedValueOnce({ response: { status: 500, data: { error: 'Internal Server Error' } } });

    await performLoginFail(setLogged);
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
    axios.post.mockRejectedValueOnce({ response: { status: 500, data: { error: 'Internal Server Error' } } });

    await performLoginFail(setLogged, 'testUser', 'testPassword', 'Espere, estamos cargando sus datos...', true);
  });
});
