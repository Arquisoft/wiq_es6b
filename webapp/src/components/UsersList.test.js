import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import axios from 'axios';
import UsersList from './UsersList';

jest.mock('axios');

describe('UsersList', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      status: 200,
      data: [
        {
          createdAt: new Date('2012-07-27T00:00:00Z'),
          username: "alejandro",
          password: "cccccccc",
        },
        {
          createdAt: new Date('2002-11-15T00:00:00Z'),
          username: "zacarías",
          password: "aaaaaaaa",
        },
        {
          createdAt: new Date('2024-02-02T00:00:00Z'),
          username: "eusebio",
          password: "bbbbbbbb",
        },
      ],
    });
  });

  it('renders headers list correctly', async () => {
    await act(async () => {
      render(<UsersList />);
    });

    // Check if the table headers are in the document
    const usernameHeader = screen.getByRole('columnheader', { name: /Nombre de Usuario/i });
    const createdAtHeader = screen.getByRole('columnheader', { name: /Fecha de Registro/i });

    expect(usernameHeader).toBeInTheDocument();
    expect(createdAtHeader).toBeInTheDocument();
  });

  it('renders all the users rows', async () => {
    await act(async () => {
      render(<UsersList />);
    });    
    // Check if the table rows are in the document
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).not.toHaveLength(0);
  });

  it('should order users by username correctly', async () => {
    await act(async () => {
      render(<UsersList />);
    }); 

    // We click the username header to order the users by username
    const usernameHeader = screen.getByRole('columnheader', { name: /Nombre de Usuario/i });
    
    await act(async() => {
      usernameHeader.click();
    });

    // We wait for the users to be loaded and the table to be updated
    let rows = await screen.findAllByRole('row');

    // We check if the first row is the one with the username 'alejandro'
    expect(rows[1]).toHaveTextContent('alejandro');
    expect(rows[2]).toHaveTextContent('eusebio');
    expect(rows[3]).toHaveTextContent('zacarías');

    await act(async() => {
      usernameHeader.click();
    });

    // We wait for the users to be loaded and the table to be updated
    rows = await screen.findAllByRole('row');

    // We check if the first row is the one with the username 'alejandro'
    expect(rows[3]).toHaveTextContent('alejandro');
    expect(rows[2]).toHaveTextContent('eusebio');
    expect(rows[1]).toHaveTextContent('zacarías');

    });

    it('should order users by createdAt date correctly', async () => {
      await act(async () => {
        render(<UsersList />);
      }); 
  
      // We click the username header to order the users by username
      const createdAtHeader = screen.getByRole('columnheader', { name: /Fecha de Registro/i });
      
      await act(async() => {
        createdAtHeader.click();
      });
  
      // We wait for the users to be loaded and the table to be updated
      let rows = await screen.findAllByRole('row');
  
      // We check if the first row is the one with the username 'alejandro'
      expect(rows[2]).toHaveTextContent('alejandro');
      expect(rows[1]).toHaveTextContent('eusebio');
      expect(rows[3]).toHaveTextContent('zacarías');
  
      await act(async() => {
        createdAtHeader.click();
      });
  
      // We wait for the users to be loaded and the table to be updated
      rows = await screen.findAllByRole('row');
  
      // We check if the first row is the one with the username 'alejandro'
      expect(rows[2]).toHaveTextContent('alejandro');
      expect(rows[3]).toHaveTextContent('eusebio');
      expect(rows[1]).toHaveTextContent('zacarías');
  
      });
});
