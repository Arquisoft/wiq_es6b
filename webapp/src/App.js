import React, { useState } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
//import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';

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
    <Container component="main" maxWidth="sm"  style={{ marginTop: '2rem' }}>
     <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>

      {showLogin ? <Login setLogged={handleIsLogged}/> : <AddUser />}
        {!isLogged ? (<Typography component="div" align="center" sx={{ marginTop: 2 }}>
            {showLogin ? (
                <Link name="gotoregister" component="button" variant="body2" onClick={handleToggleView}>
                    Don't have an account? Register here.
                </Link>
            ) : (
                <Link component="button" variant="body2" onClick={handleToggleView}>
                    Already have an account? Login here.
                </Link>
            )}
        </Typography>
        ) : (
            <></>
        ) }
    </Paper>
    </Container>
  );
}

export default App;
