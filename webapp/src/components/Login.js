// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, AppBar, Toolbar, Link, Paper } from '@mui/material';

import Game from './Game';
import UsersList from './UsersList';
import GeneratedQuestionsList from './GeneratedQuestionsList';

//import Link from '@mui/material/Link';

const Login = ({setLogged}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      // Extraer datos de la respuesta
      const { createdAt: userCreatedAt } = response.data;

      setCreatedAt(userCreatedAt);
      setLoginSuccess(true);

      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleShowGame = () => {
    setLogged();
    setShowGame(true);
    setShowUsersList(false);
  };

  const handleShowUsersList = () => {
    setShowUsersList(true);
    setShowGame(false);
  };


  const handleShowQuestionList = () => {
    setShowQuestionList(true);
    setShowGame(false);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
   {loginSuccess === true && (
  <AppBar position="static">
    <Toolbar>
      <Button color="inherit" onClick={handleShowGame}>
        Jugar
      </Button>
      {username === 'admin' && (
        <Button color="inherit" href="#" onClick={handleShowUsersList}>
          Historial de Usuarios
        </Button>
      )}
      {username === 'admin' && (
        <Button color="inherit" href="#" onClick={handleShowQuestionList}>
          Historial de Preguntas Generadas
        </Button>
      )}
    </Toolbar>
  </AppBar>
)}

    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      {loginSuccess ? (
        <>

      {showGame ? (
        <Game username={username} />
      ) : showUsersList ? (
        <UsersList />
      ) : 
      
      showQuestionList ? (
        <GeneratedQuestionsList />
      ) : 
      
      (
        <div>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
            Hello {username}!
          </Typography>
          <Typography component="p" variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
            Your account was created on {new Date(createdAt).toLocaleDateString()}.
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleShowGame}>
            Comenzar a jugar
          </Button>

        </div>
      )}
    </>
  ) : (
    <div>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <TextField
        margin="normal"
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={loginUser}>
        Login
      </Button>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}
    </div>
  )}
    
</Container>
</>
  );
};  


export default Login;
