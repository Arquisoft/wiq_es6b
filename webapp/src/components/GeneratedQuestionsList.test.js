import React from 'react';
import { render, screen } from '@testing-library/react';
import GeneratedQuestionsList from './GeneratedQuestionsList';

// Mock para axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
}));

describe('GeneratedQuestionsList component', () => {
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
    render(<GeneratedQuestionsList />);
    const preguntaHeader = screen.getByText(/Pregunta/i);
    expect(preguntaHeader).toBeInTheDocument();
    const respuestaCorrectaHeader = screen.getByText(/Respuesta Correcta/i);
    expect(respuestaCorrectaHeader).toBeInTheDocument();
  });
});
