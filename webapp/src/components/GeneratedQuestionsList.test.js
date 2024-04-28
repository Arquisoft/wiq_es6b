import React from 'react';
import { render, screen } from '@testing-library/react';
import GeneratedQuestionsList from './GeneratedQuestionsList';

describe('GeneratedQuestionsList component', () => {
  // Test for rendering the component and checking the main heading
  test('renders GeneratedQuestionsList component and main heading', () => {
    render(<GeneratedQuestionsList setError={() => {}} />);

    // Check if the main heading is in the document
    const heading = screen.getByRole('heading', { name: /Lista de preguntas/i });
    expect(heading).toBeInTheDocument();
  });

  // Test for rendering the table
  it('should display the table', () => {
    render(<GeneratedQuestionsList setError={() => {}} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  // Test for rendering the table headers
  test('renders table headers', () => {
    render(<GeneratedQuestionsList setError={() => {}} />);

    // Check if the table headers are in the document
    const questionHeader = screen.getByRole('columnheader', { name: /Pregunta/i });
    const answerHeader = screen.getByRole('columnheader', { name: /Respuesta Correcta/i });
    expect(questionHeader).toBeInTheDocument();
    expect(answerHeader).toBeInTheDocument();
  });

  // Test for rendering the table rows
test('renders table rows', () => {
  render(<GeneratedQuestionsList setError={() => {}} />);

  // Check if the table rows are in the document
  const tableRows = screen.getAllByRole('row');
  expect(tableRows).not.toHaveLength(0);
});

});