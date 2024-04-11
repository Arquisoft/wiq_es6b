// src/components/Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Snackbar, AppBar, Toolbar, TextField } from '@mui/material';

import PropTypes from 'prop-types';

import Game from './Game';
import UsersList from './UsersList';
import GeneratedQuestionsList from './GeneratedQuestionsList';
import RecordList from './RecordList';
import RankingList from './RankingList';
import CircularProgress from '@mui/material/CircularProgress';
import GameSettings from './GameSettings';

const Login = ({ setLogged }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showComponent, setShowComponent] = useState('login');
  const [totalTime, setTotalTime] = useState(180);
  const [settings, setSettings] = useState({});
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });
      const { createdAt: userCreatedAt } = response.data;
      const usersResponse = await axios.get(`${apiEndpoint}/getAllUsers`);
      const users = usersResponse.data;

      setCreatedAt(userCreatedAt);
      setLoginSuccess(true);
      setLogged();
      setLoading(true);
      
      for (const user of users) {
        await axios.post(`${apiEndpoint}/createUserRank`, { username: user.username });
      }
      const { data: updatedRankingData } = await axios.get(`${apiEndpoint}/actRanking`);
      await axios.post(`${apiEndpoint}/updateAllRanking`, updatedRankingData);

      setLoading(false);
      setOpenSnackbar(true);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else if (error.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const handleComponentChange = (component) => {
    setShowComponent(component);
  };

  const calculateTotalTime = () => {
    const totalTimeCalculated = (parseInt(settings.totalMins) * 60) + parseInt(settings.totalSecs);
    setTotalTime(totalTimeCalculated);
  };

  useEffect(() => {
    calculateTotalTime();
  }, [settings, calculateTotalTime]);

  return (
    <>
      {loginSuccess && (
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" onClick={() => handleComponentChange('login')}>
              Jugar
            </Button>
            {username === 'admin' && (
              <>
                <Button color="inherit" onClick={() => handleComponentChange('userList')}>
                  Historial de Usuarios
                </Button>
                <Button color="inherit" onClick={() => handleComponentChange('questionList')}>
                  Historial de Preguntas Generadas
                </Button>
              </>
            )}
            <Button color="inherit" onClick={() => handleComponentChange('recordList')}>
              Historial de jugadas
            </Button>
            <Button color="inherit" onClick={() => handleComponentChange('rankingList')}>
              Ranking
            </Button>
            <Button color="inherit" onClick={() => handleComponentChange('settings')}>
              Ajustes de partida
            </Button>
          </Toolbar>
        </AppBar>
      )}

      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              Espere, estamos cargando sus datos...
            </Typography>
          </div>
        ) : (
          <>
            {loginSuccess && (
              <>
                {showComponent === 'game' &&
                  <Game username={username} totalQuestions={settings.numberQuestions} timeLimit={totalTime} />
                }
                {showComponent === 'userList' && <UsersList />}
                {showComponent === 'questionList' && <GeneratedQuestionsList />}
                {showComponent === 'recordList' && <RecordList username={username} />}
                {showComponent === 'rankingList' && <RankingList />}
                {showComponent === 'settings' && <GameSettings setSettings={setSettings} />}
                {showComponent === 'login' && (
                  <div>
                    <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                      Hola {username}!
                    </Typography>
                    <Typography component="p" variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
                      Tu cuenta fue creada el {new Date(createdAt).toLocaleDateString()}.
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={() => handleComponentChange('game')}>
                      Comenzar a jugar
                    </Button>
                  </div>)
                }
              </>
            )}
            {!loginSuccess && (
              <>
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
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} message="Login successful" />
                {error && (
                  <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
                )}
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

Login.propTypes = {
  setLogged: PropTypes.func.isRequired,
};

export default Login;