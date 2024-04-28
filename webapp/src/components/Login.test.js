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

  async function loginAndSearch(setLogged, username, password, search=true, all = false){
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

    if(search){
      await waitFor(() => {
        expect(setLogged).toHaveBeenCalledTimes(1);
  
        expect(screen.getAllByText(/Jugar/i)).toHaveLength(2);
        expect(screen.getByText(/Historial de jugadas/i)).toBeInTheDocument();
        expect(screen.getByText(/Ranking/i)).toBeInTheDocument();
        expect(screen.getByText(/Ajustes de partida/i)).toBeInTheDocument();
  
        expect(screen.getByText(new RegExp(`Hola ${username}!`, 'i'))).toBeInTheDocument();
        expect(screen.getByText(/Tu cuenta fue creada el/i)).toBeInTheDocument();
        expect(screen.getByText(/Comenzar a jugar/i)).toBeInTheDocument();
  
        if(all){ // only for admin
          expect(screen.getByText(/Historial de Usuarios/i)).toBeInTheDocument();
          expect(screen.getByText(/Historial de Preguntas Generadas/i)).toBeInTheDocument();
        }
      });
    }
  }

  test('login with valid normal (not "admin") credentials', async () => {
    const setLogged = setupMocksSuccess();
    
    await loginAndSearch(setLogged, 'testUser', 'testPassword');
  });

  test('login with valid admin credentials', async () => {
    const setLogged = setupMocksSuccess();    
    
    await loginAndSearch(setLogged, 'admin', 'testPassword');
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
      
      await loginAndSearch(setLogged, 'admin', 'testPassword', true, true);
    });

    async function accessToTab(tabName, tabTexts){
      const usersListTab = screen.getByText(new RegExp(tabName, 'i'));
      await act(async () => {
        fireEvent.click(usersListTab);
      });

      await waitFor(async () => {
        await Promise.all(tabTexts.map(tabText => screen.findAllByText(new RegExp(tabText, 'i'))))
                      .then(elementsArray => elementsArray.forEach(elements => expect(elements.length).toBeGreaterThan(0)));
      });
    }

    test('from login try to access to usersList', async () => {
      await accessToTab('Historial de Usuarios', ['Nombre de Usuario', 'Fecha de Registro']);
    });

    test('from login try to access to generatedQuestionsList', async () => {
      await accessToTab('Historial de Preguntas Generadas', ['Lista de preguntas']);
    });

    test('from login try to access to recordList', async () => {
      const encabezados = ['Tu historial de jugadas', 'Fecha', 'Tiempo (segundos)', 'Dinero conseguido', 'Respuestas correctas', 'Respuestas falladas'];
      await accessToTab('Historial de jugadas', encabezados);
    });

    test('from login try to access to rankingList', async () => {
      const encabezados = ['Ranking', 'Nombre de Usuario', 'Porcentaje de Aciertos', 'Preguntas Correctas', 'Preguntas Falladas', 'Número de Partidas '];
      await accessToTab('Ranking', encabezados);
    });

    test('from login try to access to gameSettings', async () => {
      await accessToTab('Ajustes de partida', ['Número de preguntas', 'Seleccione el número de preguntas:', 'Duración de partida', 'Temáticas']);
    });

  });

  async function performLoginFail(setLogged, username = 'testUser', password = 'testPassword', error = 'Internal Server Error', loggedIn = false) {
    await loginAndSearch(setLogged, username, password, false);

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
