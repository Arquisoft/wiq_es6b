
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';

const UsersList = () => {
 
  const [listUsers, setListUsers] = useState([]);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';



  useEffect(() => {
    const fetchUsers = async () => {
      try {
       
        const response = await axios.get(`${apiEndpoint}/getAllUsers`);
        if (response.status === 200)  {

            const uList = response.data;
          setListUsers(uList);

        } else {
          console.error('Error obteniendo la lista de usurios');
        }
      } catch (error) {
        console.error('Error obteniendo la lista de usurios:', error);
      }
    };

    fetchUsers();
  }, [apiEndpoint]);


  return (
    <div>
    <h2>Users List</h2>
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>
          <th>ID</th>
          <th>Nombre de Usuario</th>
          <th>Fecha de Registro</th>
        </tr>
      </thead>
      <tbody>
        {listUsers.map((user, index) => (
          <tr key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.username}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  );
};

export default UsersList;
