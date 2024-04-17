// src/components/Settings.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, TextField, FormGroup, FormControlLabel, Checkbox, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

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
    const [themes, setThemes] = useState(() => {
        const storedValue = localStorage.getItem('themes');
        return storedValue ? JSON.parse(storedValue) : {
            Sports: true,
            ImportantDates: true,
            Music: true,
            Literature: true,
            Countries: true
        };
    });
    const [value, setValue] = useState('1');


    const handleQuestionsSlider = (event, newValue) => {
        setNumberQuestions(newValue);
    };
    const handleTimeTfMins = (event) => {
        let newValue = parseInt(event.target.value, 10);
        if (isNaN(newValue)) {
            newValue = 0; // Si el usuario ingresa p.e: una letra, establece el valor en 0
        } else if(newValue > 10 || newValue < 1) {
            return;
        }
        setTotalMins(parseInt(event.target.value));
    };
    const handleTimeTfSecs = (event) => {
        let newValue = parseInt(event.target.value, 10);
        if (isNaN(newValue)) {
            newValue = 0; // Si el usuario ingresa p.e: una letra, establece el valor en 0
        } else if(newValue > 60 || newValue < 0) {
            return;
        }
        if (newValue === 60 ) {
            if(totalMins === 10) {
                return;
            }
            setTotalSecs(0);
            setTotalMins((totalMins) => totalMins + 1);
        }else {
            setTotalSecs(newValue);
        }
    };
    const handleThemes = (event) => {
        const {name, checked} = event.target;
        setThemes(prevThemes => ({
            ...prevThemes,
            [name]: checked
        }));
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        localStorage.setItem('numberQuestions', numberQuestions);
        localStorage.setItem('totalMins', totalMins);
        localStorage.setItem('totalSecs', totalSecs);
        localStorage.setItem('themes', JSON.stringify(themes));
        setSettings({ numberQuestions, totalMins, totalSecs, themes });
    }, [numberQuestions, totalMins, totalSecs, themes, setSettings]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection:'column' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
                            <Tab label="Número de preguntas" value="1" />
                            <Tab label="Duración de partida" value="2" />
                            <Tab label="Temáticas" value="3" />
                        </TabList>
                    </Box>

                    <TabPanel value="1">
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
                        </div>
                    </TabPanel>

                    <TabPanel value="2">
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                    </TabPanel>

                    <TabPanel value="3">
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ width: 300 }}>
                                <Typography variant="h6" gutterBottom>
                                    Seleccione las temáticas de las preguntas:
                                </Typography>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox name='Sports' checked={themes.Sports} onChange={handleThemes} />} label="Deportes" />
                                    <FormControlLabel control={<Checkbox name='ImportantDates' checked={themes.ImportantDates} onChange={handleThemes} />} label="Fechas históricas" />
                                    <FormControlLabel control={<Checkbox name='Music' checked={themes.Music} onChange={handleThemes} />} label="Música" />
                                    <FormControlLabel control={<Checkbox name='Literature' checked={themes.Literature} onChange={handleThemes} />} label="Literatura" />
                                    <FormControlLabel control={<Checkbox name='Countries' checked={themes.Countries} onChange={handleThemes} />} label="Geografía" />
                                </FormGroup>
                            </Box>
                        </div>
                    </TabPanel>
                </TabContext>
                </Box>
            </div>
        </div>
    );
};

export default GameSettings;
