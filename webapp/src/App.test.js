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
    fireEvent.click(getByText(/Iniciar sesión/i));
    expect(result.handleIsLogged).toHaveBeenCalled();
  });
  

});