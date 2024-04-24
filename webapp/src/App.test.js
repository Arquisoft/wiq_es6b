import { render, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  let result;
  beforeEach(() => {
    result = render(<App />);
  });

  test('handleIsLogged sets logged to true', () => {
    const loginButtons = result.getAllByText(/Iniciar sesión/i);
    fireEvent.click(loginButtons[0]); // Click the first login button
    const registerLink = result.queryByText(/¿No tienes cuenta? Registrate aqui./i);
    expect(registerLink).not.toBeInTheDocument();
  });
  
  test('handleToggleView toggles the view to register', () => {
    const toggleViewButton = result.getByText(/¿No tienes cuenta? Registrate aqui./i);
    fireEvent.click(toggleViewButton);
    const registerView = result.getByText(/Registrate/i);
    expect(registerView).toBeInTheDocument();
  });
  
  test('handleToggleView toggles the view back to login', () => {
    const toggleViewButton = result.getByText(/¿No tienes cuenta? Registrate aqui./i);
    fireEvent.click(toggleViewButton);
    const backToLoginButton = result.getByText(/¿Ya tienes cuenta? Inicia sesión aqui./i);
    fireEvent.click(backToLoginButton);
    const loginButtons = result.getAllByText(/Iniciar sesión/i);
    expect(loginButtons[0]).toBeInTheDocument(); // Expect the first login button to be in the document
  });
});