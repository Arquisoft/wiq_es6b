import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Snackbar, Grid, List, ListItem, ListItemText } from '@mui/material';

const Game = ({ username, totalQuestions, timeLimit }) => {
    const [question, setQuestion] = useState({});
    const [respuestasAleatorias, setRespuestasAleatorias] = useState([]);
    const [error, setError] = useState('');
    const [correctQuestions, setCorrectQuestions] = useState(0);
    const [timer, setTimer] = useState(0);
    const [numberClics, setNumberClics] = useState(0);
    const [finished, setFinished] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [selectedOption, setSelectedOption] = useState(null); // Opción seleccionada actualmente
    const pricePerQuestion = 25;
    const delayBeforeNextQuestion = 3000; // 3 segundos de retardo antes de pasar a la siguiente pregunta

    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    useEffect(() => {
        obtenerPreguntaAleatoria();
    }, [numberClics]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!finished) {
                setTimer(timer + 1);
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer, finished]);

    const obtenerPreguntaAleatoria = async () => {
        try {
            const response = await axios.get(`${apiEndpoint}/getRandomQuestionTest`);
            setQuestion(response.data);
            const respuestas = [...response.data.incorrectas, response.data.correcta];
            setRespuestasAleatorias(respuestas.sort(() => Math.random() - 0.5).slice(0, 4)); // Mostrar solo 4 respuestas
        } catch (error) {
            console.error("Error al obtener la pregunta aleatoria", error);
            setError('Error al obtener la pregunta aleatoria');
        }
    };

    const handleTimeRemaining = () => {
        let minsR = Math.floor((timeLimit - timer) / 60);
        let minsRStr = (minsR < 10) ? '0' + minsR.toString() : minsR.toString();
        let secsR = (timeLimit - timer) % 60;
        let secsRStr = (secsR < 10) ? '0' + secsR.toString() : secsR.toString();
        return `${minsRStr}:${secsRStr}`;
    };

    const handleTimeUsed = () => {
        let minsR = Math.floor(timer / 60);
        let minsRStr = (minsR < 10) ? '0' + minsR.toString() : minsR.toString();
        let secsR = timer % 60;
        let secsRStr = (secsR < 10) ? '0' + secsR.toString() : secsR.toString();
        return `${minsRStr}:${secsRStr}`;
    }

    const handleButtonClick = async (respuestaSeleccionada, index) => {
        if (!finished) {
            if (selectedOption !== null) return; // Si ya se seleccionó una opción, no hacer nada

            setSelectedOption(index); // Guardar la opción seleccionada actualmente

            if (respuestaSeleccionada === question.correcta) {
                setCorrectQuestions(correctQuestions + 1);
                setSelectedAnswer('correct');
            } else {
                setSelectedAnswer('incorrect');
            }

            // Si ya llegamos a la última pregunta, acabamos la partida para que se muestre el resultado
            if(numberClics===totalQuestions-1){
                setFinished(true);
            }

            // Después de 3 segundos, restablecer la selección y pasar a la siguiente pregunta
            setTimeout(() => {
                setSelectedOption(null);
                setNumberClics(numberClics + 1);
                setSelectedAnswer('');
            }, delayBeforeNextQuestion);
        }
    };

    return (
        <Container maxWidth="lg">
            {numberClics >= totalQuestions || timer >= timeLimit ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        ¡Gracias por jugar!
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={`Tiempo transcurrido: ${handleTimeUsed()}`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={`Respuestas correctas: ${correctQuestions}`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={`Respuestas incorrectas: ${totalQuestions - correctQuestions}`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={`Dinero recaudado: ${pricePerQuestion * correctQuestions}`}
                            />
                        </ListItem>
                    </List>
                </div>
            ) : (
                <>
                    <Typography component="h1" variant='h5' sx={{ textAlign: 'center' }}>
                        Pregunta Número {numberClics + 1} :
                    </Typography>
                    <Typography component="h2" sx={{
                        textAlign: 'center',
                        color: ((timeLimit - timer) <= 60 && (timer % 60) % 2 === 0) ?
                            'red' : 'inherit',
                        fontStyle: 'italic',
                        fontWeight: (timer > 150 && (timer % 60) % 2 === 0) ?
                            'bold' : 'inherit'
                    }}>
                        ¡Tiempo restante {handleTimeRemaining()}!
                    </Typography>
                    <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                        {question.questionBody}
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {respuestasAleatorias.map((respuesta, index) => (
                            <Grid item xs={6} key={index}>
                                <Button
                                    variant="contained"
                                    color={
                                        selectedOption !== null
                                            ? respuesta === question.correcta
                                                ? 'success'
                                                : index === selectedOption
                                                    ? 'error'
                                                    : 'primary'
                                            : 'primary'
                                    }
                                    onClick={() => handleButtonClick(respuesta, index)}
                                    sx={{
                                        margin: '8px',
                                        textTransform: 'none',
                                        width: '100%',
                                    }}
                                >
                                    {respuesta}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
            {error && (
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
            )}
        </Container>
    );
};

export default Game;
