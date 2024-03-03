
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';

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
  }, []);


  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {listUsers.map((user,index) => (
           <li key={index}>Nombre: {user.username}, fecha de registro: {user.createdAt}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
