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
    expect(screen.getByText(/?/i)).toBeInTheDocument();
    expect(screen.getByText(/¿/i)).toBeInTheDocument();
  });

  test('displays game summary after 180 seconds', async () => {
    render(<Game username="testUser" totalQuestions={10} timeLimit={3} themes={{}} />); // Reducimos el límite de tiempo para el test
    // Esperamos a que se muestre el resumen del juego al finalizar el tiempo límite
    await waitFor(() => screen.getByText(/¡Gracias por jugar!/i));
    // Verificamos que se muestren los elementos del resumen del juego
    expect(screen.getByText(/Tiempo transcurrido:/i)).toBeInTheDocument();
    expect(screen.getByText(/Respuestas correctas:/i)).toBeInTheDocument();
    expect(screen.getByText(/Respuestas incorrectas:/i)).toBeInTheDocument();
    expect(screen.getByText(/Dinero recaudado:/i)).toBeInTheDocument();
  });

  test('renders 4 option buttons', () => {
    render(<Game username="testUser" totalQuestions={10} timeLimit={180} themes={{}} />);
    const optionButtons = screen.getAllByRole('button', { name: /^respuesta/i });
    expect(optionButtons).toHaveLength(4);
  });
});