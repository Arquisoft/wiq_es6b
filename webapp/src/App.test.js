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

  test('handles login', () => {
    const { getByText } = result;
    fireEvent.click(getByText("Iniciar sesión", { selector: 'button' }));
   
  });
  

  test('toggles view between login and register', () => {
    const { getByText } = result;
    fireEvent.click(getByText(/¿No tienes cuenta? Registrate aqui./i));
    const loginButtons = screen.getAllByText(/Añadir usuario/i);
    expect(loginButtons).toBeInTheDocument();
  });
});