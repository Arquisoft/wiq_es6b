// src/components/Settings.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, TextField } from '@mui/material';

const GameSettings = ({ setSettings }) => {
    const [numberQuestions, setNumberQuestions] = useState(() => {
        const storedValue = localStorage.getItem('numberQuestions');
        return storedValue ? parseInt(storedValue) : 10;
    });

    const markQuestions = [
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 15, label: '15' },
        { value: 20, label: '20' },
        { value: 25, label: '25' },
        { value: 30, label: '30' },
    ];
    const [totalMins, setTotalMins] = useState(() => {
        const storedValue = localStorage.getItem('totalMins');
        return storedValue ? parseInt(storedValue) : 3;
    });
    const [totalSecs, setTotalSecs] = useState(() => {
        const storedValue = localStorage.getItem('totalSecs');
        return storedValue ? parseInt(storedValue) : 0;
    });

    const handleQuestionsSlider = (event, newValue) => {
        setNumberQuestions(newValue);
    };
    const handleTimeTfMins = (event) => {
        setTotalMins(parseInt(event.target.value));
    };
    const handleTimeTfSecs = (event) => {
        if (parseInt(event.target.value) === 60) {
            setTotalSecs(0);
            setTotalMins((totalMins) => totalMins + 1);
        } else if (parseInt(event.target.value) === 0) {
            setTotalSecs(50);
            setTotalMins((totalMins) => totalMins - 1);
        } else {
            setTotalSecs(parseInt(event.target.value));
        }
    };

    useEffect(() => {
        localStorage.setItem('numberQuestions', numberQuestions);
        localStorage.setItem('totalMins', totalMins);
        localStorage.setItem('totalSecs', totalSecs);
        setSettings({ numberQuestions, totalMins, totalSecs });
    }, [numberQuestions, totalMins, totalSecs, setSettings]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 300 }}>
                <Typography variant="h6" gutterBottom>
                    Seleccione el número de preguntas:
                </Typography>
                <Slider
                    aria-label="Custom marks"
                    defaultValue={10}
                    value={numberQuestions}
                    onChange={handleQuestionsSlider}
                    step={5}
                    valueLabelDisplay="auto"
                    marks={markQuestions}
                    min={markQuestions[0].value}
                    max={markQuestions[markQuestions.length - 1].value}
                />
            </Box>
            <Box sx={{ width: 300 }}>
                <Typography variant="h6" gutterBottom>
                    Seleccione el tiempo máximo de partida:
                </Typography>
                <TextField
                    label="Minutos:"
                    value={totalMins}
                    onChange={handleTimeTfMins}
                    type="number"
                    inputProps={{
                        min: 1,
                        max: 10,
                        step: 1,
                    }}
                    sx={{ marginBottom: '1rem', marginRight: '0.5rem', marginTop: '1rem' }}
                />
                <TextField
                    label="Segundos:"
                    value={totalSecs}
                    onChange={handleTimeTfSecs}
                    type="number"
                    inputProps={{
                        min: 0,
                        max: 60,
                        step: 10,
                    }}
                    sx={{ marginBottom: '1rem', marginTop: '1rem' }}
                />
            </Box>
        </div>
    );
};

export default GameSettings;
