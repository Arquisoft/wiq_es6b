import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import GeneratedQuestionsList from './GeneratedQuestionsList';

const mockAxios = new MockAdapter(axios);

describe('GeneratedQuestionsList component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should display "Lista de preguntas" header', async () => {
    render(<GeneratedQuestionsList />);

    const header = screen.getByText(/Lista de preguntas/i);
    expect(header).toBeInTheDocument();
  });

  it('should display the table', async () => {
    render(<GeneratedQuestionsList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should display "Pregunta" and "Respuesta Correcta" headers', async () => {
    // Mocking the response for the GET request
    const mockData = [
      { generatedQuestionBody: 'Pregunta 1', correctAnswer: 'Respuesta 1' },
      { generatedQuestionBody: 'Pregunta 2', correctAnswer: 'Respuesta 2' },
    ];
    mockAxios.onGet('/getAllGeneratedQuestions').reply(200, mockData);

    render(<GeneratedQuestionsList />);
    
    const preguntaHeader = screen.getByText(/Pregunta/i);
    expect(preguntaHeader).toBeInTheDocument();

    const respuestaCorrectaHeader = screen.getByText(/Respuesta Correcta/i);
    expect(respuestaCorrectaHeader).toBeInTheDocument();
  });
});
