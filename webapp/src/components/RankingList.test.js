import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import RankingList from './RankingList';
import axios from 'axios';



describe('RankingList', () => {
  describe('successful requests', () => {
    beforeEach(() => {
      axios.get.mockResolvedValue({
        status: 200,
        data: [
          {
            username: "manuel",
            porcentajeAciertos: 90,
            preguntasCorrectas: 180,
            preguntasFalladas: 20,
            numPartidas: 200,
          },
          {
            username: "maría",
            porcentajeAciertos: 50,
            preguntasCorrectas: 200,
            preguntasFalladas: 200,
            numPartidas: 400,
          },
          {
            username: "pedro",
            porcentajeAciertos: 22,
            preguntasCorrectas: 22,
            preguntasFalladas: 78,
            numPartidas: 100,
          },
          {
            username: "troll",
            porcentajeAciertos: 5,
            preguntasCorrectas: 15,
            preguntasFalladas: 285,
            numPartidas: 300,
          },
        ],
      });
    });

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

    test('show ranking table with content', async () => {
      render(<RankingList />);
      const table = screen.getByRole('table');
      const rows = await screen.findAllByRole('row');
      expect(rows).toHaveLength(5);
    });

    test('show users ordered by "porcentajeAciertos" correctly', async () => {
      render(<RankingList />);
      const porcentajeAciertosHeader = screen.getByRole('columnheader', { name: /Porcentaje de Aciertos/i });
      
      await act(async() => {
        porcentajeAciertosHeader.click();
      });

      // We wait for the users to be loaded and the table to be updated
      let rows = await screen.findAllByRole('row');

      // We check if the first row is the one with the username 'manuel'
      expect(rows[1]).toHaveTextContent('manuel');
      expect(rows[2]).toHaveTextContent('maría');
      expect(rows[3]).toHaveTextContent('pedro');
      expect(rows[4]).toHaveTextContent('troll');

      await act(async() => {
        porcentajeAciertosHeader.click();
      });

      // We wait for the users to be loaded and the table to be updated
      rows = await screen.findAllByRole('row');

      // We check if the first row is the one with the username 'troll'
      expect(rows[4]).toHaveTextContent('manuel');
      expect(rows[3]).toHaveTextContent('maría');
      expect(rows[2]).toHaveTextContent('pedro');
      expect(rows[1]).toHaveTextContent('troll');
    });

    test('show users ordered by "preguntasCorrectas" correctly', async () => {
      render(<RankingList />);
      const preguntasCorrectasHeader = screen.getByRole('columnheader', { name: /Preguntas Correctas/i });
      
      await act(async() => {
        preguntasCorrectasHeader.click();
      });

      // We wait for the users to be loaded and the table to be updated
      let rows = await screen.findAllByRole('row');

      // We check if the first row is the one with the username 'maría'
      expect(rows[2]).toHaveTextContent('manuel');
      expect(rows[1]).toHaveTextContent('maría');
      expect(rows[3]).toHaveTextContent('pedro');
      expect(rows[4]).toHaveTextContent('troll');

      await act(async() => {
        preguntasCorrectasHeader.click();
      });

      // We wait for the users to be loaded and the table to be updated
      rows = await screen.findAllByRole('row');

      // We check if the first row is the one with the username 'troll'
      expect(rows[3]).toHaveTextContent('manuel');
      expect(rows[4]).toHaveTextContent('maría');
      expect(rows[2]).toHaveTextContent('pedro');
      expect(rows[1]).toHaveTextContent('troll');
    });

    test('show users ordered by "preguntasFalladas" correctly', async () => {
      render(<RankingList />);
      const preguntasFalladasHeader = screen.getByRole('columnheader', { name: /Preguntas Falladas/i });
      
      await act(async() => {
        preguntasFalladasHeader.click();
      });

      // We wait for the users to be loaded and the table to be updated
      let rows = await screen.findAllByRole('row');

      // We check if the first row is the one with the username 'maría'
      expect(rows[4]).toHaveTextContent('manuel');
      expect(rows[2]).toHaveTextContent('maría');
      expect(rows[3]).toHaveTextContent('pedro');
      expect(rows[1]).toHaveTextContent('troll');

      await act(async() => {
        preguntasFalladasHeader.click();
      });

      // We wait for the users to be loaded and the table to be updated
      rows = await screen.findAllByRole('row');

      // We check if the first row is the one with the username 'manuel'
      expect(rows[1]).toHaveTextContent('manuel');
      expect(rows[3]).toHaveTextContent('maría');
      expect(rows[2]).toHaveTextContent('pedro');
      expect(rows[4]).toHaveTextContent('troll');
    });

    test('show users ordered by "numeroPartidas" correctly', async () => {
      render(<RankingList />);
      const numPartidasHeader = screen.getByRole('columnheader', { name: /Número de Partidas/i });
      
      await act(async() => {
        numPartidasHeader.click();
      });

      // We wait for the users to be loaded and the table to be updated
      let rows = await screen.findAllByRole('row');

      // We check if the first row is the one with the username 'maría'
      expect(rows[3]).toHaveTextContent('manuel');
      expect(rows[1]).toHaveTextContent('maría');
      expect(rows[4]).toHaveTextContent('pedro');
      expect(rows[2]).toHaveTextContent('troll');

      await act(async() => {
        numPartidasHeader.click();
      });

      // We wait for the users to be loaded and the table to be updated
      rows = await screen.findAllByRole('row');

      // We check if the first row is the one with the username 'pedro'
      expect(rows[2]).toHaveTextContent('manuel');
      expect(rows[4]).toHaveTextContent('maría');
      expect(rows[1]).toHaveTextContent('pedro');
      expect(rows[3]).toHaveTextContent('troll');
    });

  }); // fin tests correctos

});
