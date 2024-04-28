import React from 'react';
import { render, waitFor } from '@testing-library/react';
import RecordList from './RecordList';
import axios from 'axios';

jest.mock('axios');

describe('RecordList', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      status: 200,
      data: [
        {
          date: new Date().toISOString(),
          time: 60,
          money: 1000000,
          correctQuestions: 8,
          failedQuestions: 2,
        },
        {
          date: new Date().toISOString(),
          time: 45,
          money: 800000,
          correctQuestions: 7,
          failedQuestions: 3,
        },
      ],
    });
  });

  it('renders record list correctly', async () => {
    const { getByText } = render(<RecordList setError={() => {}} username="testuser" />);
    
    await waitFor(() => {
      expect(getByText('Tu historial de jugadas')).toBeInTheDocument();
      expect(getByText('Fecha')).toBeInTheDocument();
      expect(getByText('Tiempo (segundos)')).toBeInTheDocument();
      expect(getByText('Dinero conseguido')).toBeInTheDocument();
      expect(getByText('Respuestas correctas')).toBeInTheDocument();
      expect(getByText('Respuestas falladas')).toBeInTheDocument();
    });

  });
});
