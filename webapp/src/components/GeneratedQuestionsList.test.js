import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen } from '@testing-library/react';
import GeneratedQuestionsList from './GeneratedQuestionsList';

const mockAxios = new MockAdapter(axios);

describe('GeneratedQuestionsList component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should display "Lista de preguntas" header', async () => {
    mockAxios.onGet('http://localhost:8000/getAllGeneratedQuestions').reply(200, []);

    render(<GeneratedQuestionsList />);

    const header = screen.getByText(/Lista de preguntas/i);
    expect(header).toBeInTheDocument();
  });

  it('should display the table', async () => {
    mockAxios.onGet('http://localhost:8000/getAllGeneratedQuestions').reply(200, []);

    render(<GeneratedQuestionsList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should display error message when failed to fetch questions', async () => {
    mockAxios.onGet('http://localhost:8000/getAllGeneratedQuestions').reply(404);

    render(<GeneratedQuestionsList />);

    const errorMessage = await screen.findByText('Error obteniendo la lista de preguntas generadas');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display error message when receiving invalid response', async () => {
    mockAxios.onGet('http://localhost:8000/getAllGeneratedQuestions').reply(200, { invalidData: true });

    render(<GeneratedQuestionsList />);

    const errorMessage = await screen.findByText('Error obteniendo la lista de preguntas generadas');
    expect(errorMessage).toBeInTheDocument();
  });
});
