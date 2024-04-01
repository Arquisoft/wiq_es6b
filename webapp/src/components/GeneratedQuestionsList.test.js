import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

  it('renders the table with "Pregunta" and "Respuesta Correcta" headers', () => {
    render(<GeneratedQuestionsList />);
    
    const preguntaHeader = screen.getByText(/Pregunta/i);
    expect(preguntaHeader).toBeInTheDocument();

    const respuestaCorrectaHeader = screen.getByText(/Respuesta Correcta/i);
    expect(respuestaCorrectaHeader).toBeInTheDocument();
  });
});
