import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  let result;
  beforeEach(() => {
    result = render(<App />);
  });

  test('clicks on the first login button', () => {
    render(<App />);
    const loginButtons = screen.getAllByText(/Iniciar sesión/i);
    expect(loginButtons[0]).toBeInTheDocument();
  });
  

  test('toggles view between login and register', () => {
    const { getByText } = result;
    fireEvent.click(getByText("¿No tienes cuenta? Registrate aqui."));
    const loginButtons = screen.getAllByText(/Añadir usuario/i);
    expect(loginButtons[0]).toBeInTheDocument();
  });

  test('tests link Iniciar sesion', () => {
    const { getByText } = result;
    fireEvent.click(getByText("¿No tienes cuenta? Registrate aqui."));
    fireEvent.click(getByText("¿Ya tienes cuenta? Inicia sesión aqui."));
    const loginButtons = screen.getAllByText(/Iniciar sesión/i);
    expect(loginButtons[0]).toBeInTheDocument();
  });
});