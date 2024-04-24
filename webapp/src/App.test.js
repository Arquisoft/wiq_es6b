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

  test('handleToggleView toggles the view to register', () => {
    const toggleViewButton = screen.getByRole('button', { name: /¿No tienes cuenta? Registrate aqui./i });
    fireEvent.click(toggleViewButton);
    const registerView = screen.getByText(/Registrate/i);
    expect(registerView).toBeInTheDocument();
  });
  
});