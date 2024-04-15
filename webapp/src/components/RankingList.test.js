import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import RankingList from './RankingList';

describe('RankingList', () => {
  it('renders without crashing', () => {
    render(<RankingList />);
  });

  it('renders the title', () => {
    const { getByText } = render(<RankingList />);
    expect(getByText('Top 3 usurios con mejor porcentaje de aciertos')).toBeInTheDocument();
  });

  it('handles sort order toggle', async () => {
    const { getByText } = render(<RankingList />);
    const usernameColumn = getByText('Nombre de Usuario ▼');

    // Click once, expect ascending order
    fireEvent.click(usernameColumn);
    expect(usernameColumn.textContent).toBe('Nombre de Usuario ▲');

    // Click again, expect descending order
    fireEvent.click(usernameColumn);
    expect(usernameColumn.textContent).toBe('Nombre de Usuario ▼');
  });

  it('renders the word "Ranking"', () => {
    const { getByText } = render(<RankingList />);
    expect(getByText('Ranking')).toBeInTheDocument();
  });

  // Test for rendering the column headers
test('renders column headers', () => {
    render(<RankingList />);
  
    // Check if the column headers are in the document
    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders).not.toHaveLength(0);
  });
  
  // Test for rendering the table rows
  test('renders table rows', () => {
    render(<RankingList />);
  
    // Check if the table rows are in the document
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).not.toHaveLength(0);
  });

  // Test for correct column headers
test('renders correct column headers', () => {
    render(<RankingList />);
  
    // Check if the correct column headers are in the document
    const usernameHeader = screen.getByText('Nombre de Usuario ▼');
    const percentageHeader = screen.getByText('Porcentaje de aciertos ▼');
    const rankingHeader = screen.getByText('Ranking ▼');
  
    expect(usernameHeader).toBeInTheDocument();
    expect(percentageHeader).toBeInTheDocument();
    expect(rankingHeader).toBeInTheDocument();
  });

  // Test for correct column headers
test('renders correct column headers', () => {
    render(<RankingList />);
  
    // Check if the correct column headers are in the document
    const usernameHeader = screen.getByText(/Nombre de Usuario/);
    const percentageHeader = screen.getByText(/Porcentaje de Aciertos/);
    const correctQuestionsHeader = screen.getByText(/Preguntas Correctas/);
    const failedQuestionsHeader = screen.getByText(/Preguntas Falladas/);
    const numPartidasHeader = screen.getByText(/Número de Partidas/);
  
    expect(usernameHeader).toBeInTheDocument();
    expect(percentageHeader).toBeInTheDocument();
    expect(correctQuestionsHeader).toBeInTheDocument();
    expect(failedQuestionsHeader).toBeInTheDocument();
    expect(numPartidasHeader).toBeInTheDocument();
  });
  
});