import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
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


  test('tests tabla ranking', () => {
    render(<RankingList />);
    expect(screen.queryByText("Ranking")).toBeInTheDocument();
    expect(screen.getByText(/Nombre de Usuario/i)).toBeInTheDocument();
    expect(screen.queryAllByText(/Porcentaje de Aciertos/i)).not.toHaveLength(0);
    expect(screen.getByText(/Preguntas Correctas/i)).toBeInTheDocument();
    expect(screen.getByText(/Preguntas Falladas/i)).toBeInTheDocument();
    expect(screen.getByText(/Número de Partidas/i)).toBeInTheDocument();
  });


});
