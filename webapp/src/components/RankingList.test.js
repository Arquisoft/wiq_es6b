import React from 'react';
import { render, screen } from '@testing-library/react';
import RankingList from './RankingList';

describe('RankingList', () => {
  it('renders without crashing', () => {
    render(<RankingList />);
  });


  test('renders RankingList component and main heading', () => {
    render(<RankingList />);

    // Check if the main heading is in the document
    const heading = screen.getByRole('heading', { name: /Top 3 usuarios con mejor porcentaje de aciertos/i });
    expect(heading).toBeInTheDocument();
  });

  // Test for rendering the column headers
test('renders column headers', () => {
    render(<RankingList />);
  
    // Check if the column headers are in the document
    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders).not.toHaveLength(0);
  });
  
  // Test for rendering the table
  it('should display the table', () => {
    render(<RankingList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });
  // Test for rendering the table headers
  test('renders table headers', () => {
    render(<RankingList />);

    // Check if the table headers are in the document
    const usernameHeader = screen.getByRole('columnheader', { name: /Nombre de Usuario/i });
    const percentageHeader = screen.getByRole('columnheader', { name: /Porcentaje de Aciertos/i });
    const correctQuestionsHeader = screen.getByRole('columnheader', { name: /Preguntas Correctas/i });
    const failedQuestionsHeader = screen.getByRole('columnheader', { name: /Preguntas Falladas/i });
    const numPartidasHeader = screen.getByRole('columnheader', { name: /Número de Partidas/i });

    expect(usernameHeader).toBeInTheDocument();
    expect(percentageHeader).toBeInTheDocument();
    expect(correctQuestionsHeader).toBeInTheDocument();
    expect(failedQuestionsHeader).toBeInTheDocument();
    expect(numPartidasHeader).toBeInTheDocument();
  });


    // Test for rendering all column headers
    test('renders all column headers', () => {
      render(<RankingList />);
  
      // Check if all the column headers are in the document
      const usernameHeader = screen.getByRole('columnheader', { name: /Nombre de Usuario/i });
      const percentageHeader = screen.getByRole('columnheader', { name: /Porcentaje de Aciertos/i });
      const correctQuestionsHeader = screen.getByRole('columnheader', { name: /Preguntas Correctas/i });
      const failedQuestionsHeader = screen.getByRole('columnheader', { name: /Preguntas Falladas/i });
      const numPartidasHeader = screen.getByRole('columnheader', { name: /Número de Partidas/i });
  
      expect(usernameHeader).toBeInTheDocument();
      expect(percentageHeader).toBeInTheDocument();
      expect(correctQuestionsHeader).toBeInTheDocument();
      expect(failedQuestionsHeader).toBeInTheDocument();
      expect(numPartidasHeader).toBeInTheDocument();
    });
});
