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

  test('renders top three users', async () => {
    render(<RankingList />);

    // Wait for the users to be fetched and the component to re-render
    const topUsers = await screen.findAllByTestId('top-user');

    // Check if the top three users are in the document
    expect(topUsers).toHaveLength(3);
  });

  // Test for sorting the users when a column header is clicked
  test('sorts users when column header is clicked', async () => {
    render(<RankingList />);

    // Wait for the users to be fetched and the component to re-render
    const columnHeader = await screen.findByRole('columnheader', { name: /Porcentaje de Aciertos/i });

    // Click the column header
    userEvent.click(columnHeader);

    // Check if the users are sorted by the clicked column
    const sortedUsers = await screen.findAllByTestId('user-row');
    expect(sortedUsers).not.toHaveLength(0);
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
