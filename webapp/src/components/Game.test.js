import { render, screen } from '@testing-library/react';
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
    // Assuming that the initial question body is empty
    expect(screen.getByText(/^$/i)).toBeInTheDocument();
  });

  test('displays error message when error state is not empty', () => {
    const { rerender } = render(<Game username="testUser" totalQuestions={10} timeLimit={180} themes={{}} />);
    rerender(<Game username="testUser" totalQuestions={10} timeLimit={180} themes={{}} error="Test error" />);
    expect(screen.getByText(/Error: Test error/i)).toBeInTheDocument();
  });
});