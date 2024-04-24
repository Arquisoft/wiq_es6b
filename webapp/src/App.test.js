import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login view by default', () => {
  render(<App />);
  const loginElement = screen.getByText(/Inicia sesión aqui./i);
  expect(loginElement).toBeInTheDocument();
});

test('renders register view when register link is clicked', () => {
  render(<App />);
  const registerLink = screen.getByRole('button', { name: /¿No tienes cuenta? Registrate aqui./i });
  registerLink.click();
  const registerElement = screen.getByText(/¿Ya tienes cuenta? Inicia sesión aqui./i);
  expect(registerElement).toBeInTheDocument();
});

test('renders login view when login link is clicked in register view', () => {
  render(<App />);
  const registerLink = screen.getByRole('button', { name: /¿No tienes cuenta? Registrate aqui./i });
  registerLink.click();
  const loginLink = screen.getByRole('button', { name: /¿Ya tienes cuenta? Inicia sesión aqui./i });
  loginLink.click();
  const loginElement = screen.getByText(/Inicia sesión aqui./i);
  expect(loginElement).toBeInTheDocument();
});