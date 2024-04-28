import React from 'react';
import { render, screen, act } from '@testing-library/react';
import GeneratedQuestionsList from './GeneratedQuestionsList';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

jest.mock('axios');

const mockAxios = new MockAdapter(axios);

describe('GeneratedQuestionsList component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      status: 200,
      data: [
        {
          generatedQuestionBody: "¿A qué género literario pertenece 'Cinco horas con Mario'?",
          correcta: 'Narrativo'
        },
        {
          generatedQuestionBody: "¿De qué grupo es la canción 'Vino Tinto'?",
          correcta: 'Estopa'
        },
        {
          generatedQuestionBody: "¿Cuál es la capital de Portugal?",
          correcta: 'Lisboa'
        },
        {
          generatedQuestionBody: "¿Quién escribió la novela 'El Extranjero'?",
          correcta: 'Albert Camus'
        },
      ],
    });
  });

  test('renders GeneratedQuestionsList component and main heading', async () => {
    await act( async () => {
      render(<GeneratedQuestionsList setError={() => {}} />);
    });
    const heading = screen.getByRole('heading', { name: /Lista de preguntas/i });
    expect(heading).toBeInTheDocument();
  });

  it('should display the table', async () => {
    await act( async () => {
      render(<GeneratedQuestionsList setError={() => {}} />);
    });
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  test('renders table headers', async () => {
    await act( async () => {
      render(<GeneratedQuestionsList setError={() => {}} />);
    });
    const questionHeader = screen.getByRole('columnheader', { name: /Pregunta/i });
    const answerHeader = screen.getByRole('columnheader', { name: /Respuesta Correcta/i });
    expect(questionHeader).toBeInTheDocument();
    expect(answerHeader).toBeInTheDocument();
  });

  test('renders table rows', async () => {
    await act( async () => {
      render(<GeneratedQuestionsList setError={() => {}} />);
    });
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).not.toHaveLength(0);
  });

  test('should order questions by questionBody correctly', async () => {
    await act(async () => {
      render(<GeneratedQuestionsList setError={() => {}} />);
    });   

    const questionBodyHeader = screen.getByRole('columnheader', { name: /Pregunta/i });
          
    await act(async() => {
      questionBodyHeader.click();
    });

    let rows = await screen.findAllByRole('row');

    expect(rows[1]).toHaveTextContent("¿A qué género literario pertenece 'Cinco horas con Mario'?");
    expect(rows[2]).toHaveTextContent("¿Cuál es la capital de Portugal?");
    expect(rows[3]).toHaveTextContent("¿De qué grupo es la canción 'Vino Tinto'?");
    expect(rows[4]).toHaveTextContent("¿Quién escribió la novela 'El Extranjero'?");

    await act(async() => {
      questionBodyHeader.click();
    });

    rows = await screen.findAllByRole('row');

    expect(rows[4]).toHaveTextContent("¿A qué género literario pertenece 'Cinco horas con Mario'?");
    expect(rows[3]).toHaveTextContent("¿Cuál es la capital de Portugal?");
    expect(rows[2]).toHaveTextContent("¿De qué grupo es la canción 'Vino Tinto'?");
    expect(rows[1]).toHaveTextContent("¿Quién escribió la novela 'El Extranjero'?");
  });

  test('should order questions by answer correctly', async () => {
    await act(async () => {
      render(<GeneratedQuestionsList setError={() => {}} />);
    });

    const answerHeader = screen.getByRole('columnheader', { name: /Respuesta Correcta/i });
          
    await act(async() => {
      answerHeader.click();
    });

    let rows = await screen.findAllByRole('row');

    expect(rows[1]).toHaveTextContent("Albert Camus");
    expect(rows[2]).toHaveTextContent("Estopa");
    expect(rows[3]).toHaveTextContent("Lisboa");
    expect(rows[4]).toHaveTextContent("Narrativo");


    await act(async() => {
      answerHeader.click();
    });

    rows = await screen.findAllByRole('row');

    expect(rows[4]).toHaveTextContent("Albert Camus");
    expect(rows[3]).toHaveTextContent("Estopa");
    expect(rows[2]).toHaveTextContent("Lisboa");
    expect(rows[1]).toHaveTextContent("Narrativo");
  });

});