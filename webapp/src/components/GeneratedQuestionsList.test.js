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

  it('should render list of questions', async () => {
    // Mocking the response for axios.get
    const mockQuestions = [
      { generatedQuestionBody: 'Question 1', correctAnswer: 'Answer 1' },
      { generatedQuestionBody: 'Question 2', correctAnswer: 'Answer 2' },
    ];
    mockAxios.onGet('http://localhost:8000/getAllGeneratedQuestions').reply(200, mockQuestions);

    render(<GeneratedQuestionsList />);

    // Wait for the questions to be rendered
    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Answer 1')).toBeInTheDocument();
      expect(screen.getByText('Question 2')).toBeInTheDocument();
      expect(screen.getByText('Answer 2')).toBeInTheDocument();
    });
  });

  it('should handle error when fetching questions', async () => {
    // Mocking an error response for axios.get
    mockAxios.onGet('http://localhost:8000/getAllGeneratedQuestions').reply(500);

    render(<GeneratedQuestionsList />);

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Error obteniendo la lista de preguntas generadas')).toBeInTheDocument();
    });
  });

  // Add more tests as needed for sorting functionality, etc.
});
