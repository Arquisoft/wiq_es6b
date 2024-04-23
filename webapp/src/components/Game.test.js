import { render, screen, waitFor } from '@testing-library/react';
import Game from './Game';

describe('Game component', () => {
  test('renders without crashing', () => {
    render(<Game username="testUser" totalQuestions={10} timeLimit={180} themes={{}} />);
    expect(screen.getByText(/Pregunta Número 1/i)).toBeInTheDocument();
  });

  test('displays time remaining', () => {
    render(<Game username="testUser" totalQuestions={10} timeLimit={180} themes={{}} />);
    expect(screen.getByText(/¡Tiempo restante 03:00!/i)).toBeInTheDocument();
  });

  test('displays question body', () => {
    render(<Game username="testUser" totalQuestions={10} timeLimit={180} themes={{}} />);
    expect(screen.getByText(/\?/i)).toBeInTheDocument();
    expect(screen.getByText(/¿/i)).toBeInTheDocument();
});

  test('renders 4 option buttons', () => {
    render(<Game username="testUser" totalQuestions={10} timeLimit={180} themes={{}} />);
    const optionButtons = screen.getAllByRole('button', { name: /^respuesta/i });
    expect(optionButtons).toHaveLength(4);
  });
});