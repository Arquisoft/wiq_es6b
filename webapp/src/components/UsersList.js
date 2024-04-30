
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const UsersList = ({ setError }) => {
 
  const [listUsers, setListUsers] = useState([]);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');


  useEffect(() => {
    const fetchUsers = async () => {
      try {
       
        const response = await axios.get(`${apiEndpoint}/getAllUsers`);
        if (response.status === 200)  {
          const uList = response.data.map(record => ({
            ...record,
            createdAt: new Date(record.createdAt).toLocaleString(),
          }));
          setListUsers(uList);

        } else {
          setError('Error obteniendo la lista de usurios');
        }
      } catch (error) {
        setError(`Error obteniendo la lista de usurios: ${error}`);
      }
    };
    fetchUsers();
  }, [apiEndpoint, setError]);

  const sortedUsers = [...listUsers].sort((a, b) => {
    if (sortColumn === 'username') {
      return sortOrder === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
    } else if (sortColumn === 'createdAt') {
      return sortOrder === 'asc' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt);
    } else {
      return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
    }
  });



  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };  

  return (
    <div>
    <h2>Lista de usuarios</h2>
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>
         
          <th onClick={() => handleSort('username')}>Nombre de Usuario {sortColumn === 'username' && sortOrder === 'asc' ? '▲' : '▼'}</th>
          <th onClick={() => handleSort('createdAt')}>Fecha de Registro {sortColumn === 'createdAt' && sortOrder === 'asc' ? '▲' : '▼'}</th>
        </tr>
      </thead>
      <tbody>
        {sortedUsers.map((user, index) => (
          <tr key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>
           
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.username}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

UsersList.propTypes = {
  setError: PropTypes.func.isRequired,
};

export default UsersList;