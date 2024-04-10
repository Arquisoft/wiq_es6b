import React from 'react';
import { render, screen } from '@testing-library/react';
import GeneratedQuestionsList from './GeneratedQuestionsList';


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


});
