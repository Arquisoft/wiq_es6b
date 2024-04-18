import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import UsersList from './UsersList';

jest.mock('axios');

describe('UsersList', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      status: 200,
      data: [
        {
          createdAt: new Date().toISOString(),
          username: "alejandro",
          password: "cccccccc",
        },
        {
          createdAt: new Date().toISOString(),
          username: "zacarías",
          password: "aaaaaaaa",
        },
        {
          createdAt: new Date().toISOString(),
          username: "eusebio",
          password: "bbbbbbbb",
        },
      ],
    });
  });

  it('renders headers list correctly', async () => {
    render(<UsersList />);
    
    // Check if the table headers are in the document
    const usernameHeader = screen.getByRole('columnheader', { name: /Nombre de Usuario/i });
    const createdAtHeader = screen.getByRole('columnheader', { name: /Fecha de Registro/i });

    expect(usernameHeader).toBeInTheDocument();
    expect(createdAtHeader).toBeInTheDocument();
  });

  it('renders all the users rows', async () => {
    render(<UsersList />);
    
    // Check if the table rows are in the document
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).not.toHaveLength(0);
  });

  it('should order users by username correctly', async () => {
    render(<UsersList />);
    
    // We click the username header to order the users by username
    const usernameHeader = screen.getByRole('columnheader', { name: /Nombre de Usuario/i });
    usernameHeader.click();

    // We wait for the users to be loaded and the table to be updated
    await waitFor(() => screen.getByRole('row'));

    // We get all the row elements and select the first one
    const rows = screen.getAllByRole('row');

    // We check if the first row is the one with the username 'alejandro'
    expect(rows[1]).toHaveTextContent('alejandro');
    expect(rows[2]).toHaveTextContent('eusebio');
    expect(rows[3]).toHaveTextContent('zacarías');
    });
});
