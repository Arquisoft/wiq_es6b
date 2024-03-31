// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
//import { Container, Typography, TextField, Button, Snackbar, AppBar, Toolbar, Link, Paper } from '@mui/material';
import { Container, Typography, TextField, Button, Snackbar, AppBar, Toolbar } from '@mui/material';

import Game from './Game';
import UsersList from './UsersList';
import GeneratedQuestionsList from './GeneratedQuestionsList';
import RecordList from './RecordList';
import RankingList from './RankingList';
import CircularProgress from '@mui/material/CircularProgress';

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
  const [showRecordList, setShowRecordList] = useState(false);
  const [showRankingList, setShowRankingList] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      //await axios.delete(`${apiEndpoint}/deleteAllQuestionTest`);
      //obtenerPreguntaspartida();
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      // Extraer datos de la respuesta
      const { createdAt: userCreatedAt } = response.data;
  
    // Obtener todos los usuarios
    const usersResponse = await axios.get(`${apiEndpoint}/getAllUsers`);
    const users = usersResponse.data;


    setCreatedAt(userCreatedAt);
    setLoginSuccess(true);
    setLogged();

    setLoading(true);
    // Para cada usuario, crear su ranking
    for (const user of users) {
      await axios.post(`${apiEndpoint}/createUserRank`, { username: user.username });
    }
      const { data: updatedRankingData } = await axios.get(`${apiEndpoint}/actRanking`);//obtengo datos actualizados del ranking
      await axios.post(`${apiEndpoint}/updateAllRanking`, updatedRankingData); //los actualizo
      setLoading(false);

      //setCreatedAt(userCreatedAt);
     // setLoginSuccess(true);
      //setLogged();
      setOpenSnackbar(true);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else if (error.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };



  const handleShowGame = () => {
    setShowUsersList(false);
    setShowQuestionList(false);
    setShowRecordList(false);
    setShowRankingList(false);
    setShowGame(true);

  };

  const handleShowUsersList = () => {
    setShowGame(false);
    setShowQuestionList(false);
    setShowRecordList(false);
    setShowRankingList(false);
    setShowUsersList(true);
  };

  const handleShowQuestionList = () => {
    setShowGame(false);
    setShowUsersList(false);
    setShowRecordList(false);
    setShowRankingList(false);
    setShowQuestionList(true);
  };

  const handleShowRecordList = () => {
    setShowGame(false);
    setShowUsersList(false);
    setShowQuestionList(false);
    setShowRankingList(false);
    setShowRecordList(true);
  };

  const handleShowRankingList = () => {
    setShowGame(false);
    setShowUsersList(false);
    setShowQuestionList(false);
    setShowRecordList(false);
    setShowRankingList(true);

  };

  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  

  return (
    <>
      {loginSuccess && (
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" onClick={handleShowGame}>
              Jugar
            </Button>
            {username === 'admin' && (
              <Button color="inherit" onClick={handleShowUsersList}>
                Historial de Usuarios
              </Button>
            )}
            {username === 'admin' && (
              <Button color="inherit" onClick={handleShowQuestionList}>
                Historial de Preguntas Generadas
              </Button>
            )}
            <Button color="inherit" onClick={handleShowRecordList}>
              Historial de jugadas
            </Button>
            <Button color="inherit" onClick={handleShowRankingList}>
              Ranking
            </Button>
          </Toolbar>
        </AppBar>
      )}

      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        {loading ? ( // Mostrar CircularProgress si loading es true
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              Espere, estamos cargando sus datos...
            </Typography>
          </div>
        ) : (
          loginSuccess ? (
            <>
              {showGame ? (
                <Game username={username} />
              ) : showUsersList ? (
                <UsersList />
              ) : 
              showQuestionList ? (
                <GeneratedQuestionsList />
              ) : 
              showRecordList ? (
                <RecordList username={username} />
              ) :
              showRankingList ? (
                <RankingList />
              ) :
              (
                <div>
                  <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                    Hola {username}!
                  </Typography>
                  <Typography component="p" variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
                    Tu cuenta fue creada el {new Date(createdAt).toLocaleDateString()}.
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
                Iniciar sesión
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
                Iniciar sesión
              </Button>
              <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
              {error && (
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
              )}
            </div>
          )
        )}
      </Container>
    </>
  );
};


export default Login;
