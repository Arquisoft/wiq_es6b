import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GeneratedQuestionsList from '../components/GeneratedQuestionsList';
import axios from 'axios';

jest.mock('axios');

describe('GeneratedQuestionsList component', () => {
  test('should render list of generated questions', async () => {
    // Define el mock de axios para simular una respuesta exitosa
    const mockedQuestions = [
      { generatedQuestionBody: 'Question 1', correctAnswer: 'Answer 1' },
      { generatedQuestionBody: 'Question 2', correctAnswer: 'Answer 2' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockedQuestions });

    render(<GeneratedQuestionsList />);

    // Espera a que las preguntas se muestren en la lista
    await waitFor(() => {
      mockedQuestions.forEach(question => {
        expect(screen.getByText(question.generatedQuestionBody)).toBeInTheDocument();
        expect(screen.getByText(question.correctAnswer)).toBeInTheDocument();
      });
    });
  });

  test('should handle error when fetching questions', async () => {
    // Define el mock de axios para simular una respuesta con error 500
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });

    render(<GeneratedQuestionsList />);

    // Espera a que el mensaje de error se muestre en la pantalla
    await waitFor(() => {
      expect(screen.getByText('Error obteniendo la lista de preguntas generadas')).toBeInTheDocument();
    });
  });
});
