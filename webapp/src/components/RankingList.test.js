import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

  test('renders Ranking', () => {
    render(<RankingList />);
    const headingElement = screen.getByText(/Ranking/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('fetches users from an API and displays them', async () => {
    render(<RankingList />);

    // Wait for the users to be fetched and displayed
    await waitFor(() => screen.getByText(/Nombre de Usuario/i));

    // Check if there are any cells in the table
    const items = screen.getAllByRole('cell');
    expect(items).not.toHaveLength(0);
  });

  it('should order users by percentage of correct answers correctly', async () => {
    await act(async () => {
      render(<RankingList />);
    }); 
  
    // We click the percentage header to order the users by percentage of correct answers
    const percentageHeader = screen.getByRole('columnheader', { name: /Porcentaje de Aciertos/i });
    
    await act(async() => {
      percentageHeader.click();
    });
  
    // We wait for the users to be loaded and the table to be updated
    let rows = await screen.findAllByRole('row');
  
    // We check if the first row is the one with the highest percentage
    expect(rows[1]).toHaveTextContent('user1');
    expect(rows[2]).toHaveTextContent('user2');
    expect(rows[3]).toHaveTextContent('user3');
  
    await act(async() => {
      percentageHeader.click();
    });
  
    // We wait for the users to be loaded and the table to be updated
    rows = await screen.findAllByRole('row');
  
    // We check if the first row is the one with the lowest percentage
    expect(rows[3]).toHaveTextContent('user1');
    expect(rows[2]).toHaveTextContent('user2');
    expect(rows[1]).toHaveTextContent('user3');
  });
});
