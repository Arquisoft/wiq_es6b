import React, { useState } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isLogged, setLogged] = useState(false);

  const handleIsLogged = () => {
    setLogged(true);
  };

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Container component="main" maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center', overflow: 'auto' }}>
            {showLogin ? <Login setLogged={handleIsLogged}/> : <AddUser />}
            {!isLogged && (
              <Typography component="div" align="center" sx={{ marginTop: 4 }}>
                {showLogin ? (
                  <Link name="gotoregister" component="button" variant="body2" onClick={handleToggleView}>
                    ¿No tienes cuenta? Registrate aquí.
                  </Link>
                ) : (
                  <Link component="button" variant="body2" onClick={handleToggleView}>
                    ¿Ya tienes cuenta? Inicia sesión aquí.
                  </Link>
                )}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;

