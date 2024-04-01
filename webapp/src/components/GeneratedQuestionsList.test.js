import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import GeneratedQuestionsList from './GeneratedQuestionsList';

// Configura el adaptador de mock de axios
const mock = new MockAdapter(axios);

// Configura el comportamiento para la solicitud de getAllGeneratedQuestions
mock.onGet('http://localhost:8000/getAllGeneratedQuestions').reply(200, {
  generatedQuestions: [
    {
      id: 1,
      generatedQuestionBody: "¿Cuál es la capital de Francia?",
      correctAnswer: "París"
    },
    {
      id: 2,
      generatedQuestionBody: "¿En qué año comenzó la Primera Guerra Mundial?",
      correctAnswer: "1914"
    },
    // Agrega más preguntas según sea necesario
  ]
});

describe('GeneratedQuestionsList component', () => {
  it('should render correctly', async () => {
    // Renderizar el componente
    render(<GeneratedQuestionsList />);

    // Esperar a que se muestre la lista de preguntas generadas
    await waitFor(() => {
      expect(screen.getByText("¿Cuál es la capital de Francia?")).toBeInTheDocument();
      expect(screen.getByText("¿En qué año comenzó la Primera Guerra Mundial?")).toBeInTheDocument();
      // Agrega más aserciones según sea necesario para verificar que todas las preguntas se muestran correctamente
    });
  });
});
