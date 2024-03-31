// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
//import { Container, Typography, TextField, Button, Snackbar, AppBar, Toolbar, Link, Paper } from '@mui/material';
import { Container, Typography, TextField, Button, Snackbar, AppBar, Toolbar, Box, Slider } from '@mui/material';

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
  const [showSettings, setShowSettings] = useState(false);
  const [numberQuestions, setNumberQuestions] = useState(10); // 10 preguntas por defecto
  const markQuestions = [
    {value:5},
    {value:10},
    {value:15},
    {value:20},
    {value:25},
    {value:30},
  ];
  const [totalTime, setTotalTime] = useState(180); // tiempo por defecto de 3 mins

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
  const handleShowSettings = () => {
    setShowSettings(true);
  };
  function valuetext(value){
    return `${value} preguntas`;
  };
  const handleQuestionsSlider = (event, newValue) => {
    setNumberQuestions(newValue); // Cambio el número de preguntas establecidas en ajustes de partida
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
                <Button color="inherit" onClick={handleShowSettings}>
                  Ajustes de partida
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
                        <Game username={username} totalQuestions={numberQuestions} timeLimit={totalTime} />
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
                                    showSettings ? (
                                            <Box sx={{ width: 300, display: 'flex', justifyContent: 'center' }}>
                                              <Slider
                                                  aria-label="Custom marks"
                                                  defaultValue={10}
                                                  value={numberQuestions}
                                                  onChange={handleQuestionsSlider} // manejador cambio en slider
                                                  getAriaValueText={valuetext} // valor mostrado en la etiqueta
                                                  step={5}
                                                  valueLabelDisplay="auto"
                                                  marks={markQuestions}
                                                  max={markQuestions[markQuestions.length-1].value} // valor máximo seleccionable
                                              />
                                            </Box>
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