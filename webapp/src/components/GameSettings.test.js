import React from 'react';
import { render, waitFor, fireEvent, queryByAltText } from '@testing-library/react';
import GameSettings from './GameSettings';

describe('GameSettings', () => {
  it('renders game settings correctly', async () => {
    const { getByText, getByRole, getAllByRole, getByLabelText } = render(<GameSettings setSettings={() => {}} currentUser="usuarioPrueba" />);
    
    await waitFor(() => {
      expect(getByText('Número de preguntas')).toBeInTheDocument();
      expect(getByText('Duración de partida')).toBeInTheDocument();
      expect(getByText('Temáticas')).toBeInTheDocument();

      // pestaña predeterminada aparece correctamente
      expect(getByText('Seleccione el número de preguntas:')).toBeInTheDocument();
    
      // comprobamos que de manera predeterminada el slider está en 10
      const slider = getByRole('slider');
      expect(slider.value).toBe('10');
    });

    // nos movemos a duración de partida
    const timeSettingTab = getByText('Duración de partida');
    fireEvent.click(timeSettingTab);

    await waitFor(() => {
      expect(getByText('Seleccione el tiempo máximo de partida:')).toBeInTheDocument();
      
      // comprobamos que la duración de partida predeterminada es 3 minutos
      const timeTextFieldUpdated = getAllByRole('spinbutton', { min: 1, max: 10 });
      expect(timeTextFieldUpdated[0].value).toBe('3');
      expect(timeTextFieldUpdated[1].value).toBe('0');
    });

    // nos movemos a la zona de temáticas
    const themesSettingTab = getByText('Temáticas');
    fireEvent.click(themesSettingTab);

    await waitFor(() => {
      expect(getByText('Seleccione las temáticas de las preguntas:')).toBeInTheDocument();
      // aparecen los 5 temas
      expect(getByText('Deportes')).toBeInTheDocument();
      expect(getByText('Fechas históricas')).toBeInTheDocument();
      expect(getByText('Música')).toBeInTheDocument();
      expect(getByText('Literatura')).toBeInTheDocument();
      expect(getByText('Geografía')).toBeInTheDocument();
      // comprobamos que de manera predeterminada todos los temas están seleccionados
      const sportstheme = getByLabelText('Deportes');
      expect(sportstheme.checked).toBe(true);
      const datestheme = getByLabelText('Fechas históricas');
      expect(datestheme.checked).toBe(true);
      const musictheme = getByLabelText('Música');
      expect(musictheme.checked).toBe(true);
      const literaturetheme = getByLabelText('Literatura');
      expect(literaturetheme.checked).toBe(true);
      const geotheme = getByLabelText('Geografía');
      expect(geotheme.checked).toBe(true);
    });
  });

  it('we can modify the settings in each tab', async () => {
    const { getByText, getByRole, getAllByRole } = render(<GameSettings setSettings={() => {}} currentUser="usuarioPrueba" />);
  
    // establecemos en el slider 5 preguntas por partida
    const slider = getByRole('slider');
    fireEvent.change(slider, { target: { value: 5 } });
  
    // nos movemos a duración de partida
    const timeSettingTab = getByText('Duración de partida');
    fireEvent.click(timeSettingTab);
    // establecemos 2 minuto de duración de partida
    const timeTextField = getAllByRole('spinbutton', { min: 1, max: 10 });
    expect(timeTextField[0].value).toBe('3');
    // Simula 6 eventos de clic en el botón de decremento
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowDown', code: 'ArrowDown' });
    // Comprueba que el valor del spinbutton se ha decrementado a 2
    expect(timeTextField[0].value).toBe('2');

    // subo a 4 minutos la duración de partida
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });

    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(timeTextField[0], { key: 'ArrowUp', code: 'ArrowUp' });

    // nos movemos de vuelta a número de preguntas
    const numberQuestionsTab = getByText('Duración de partida');
    fireEvent.click(numberQuestionsTab);
    // comprobamos que el valor del slider se ha mantenido
    expect(slider.value).toBe('5');

    // nos movemos de vuelta a duración de partida
    fireEvent.click(timeSettingTab);
    const timeTextFieldUpdated = getAllByRole('spinbutton', { min: 1, max: 10 });
    // comprobamos que la duración de partida se ha mantenido
    expect(timeTextFieldUpdated[0].value).toBe('4');
    expect(timeTextFieldUpdated[1].value).toBe('0');
  });

  it('we cant put an invalid value in timer settings', async () => {
    const { getByText, getAllByRole } = render(<GameSettings setSettings={() => {}} currentUser="usuarioPrueba" />);
  
    // nos movemos a duración de partida
    const timeSettingTab = getByText('Duración de partida');
    fireEvent.click(timeSettingTab);
    // intentamos establecer 0 minutos de duración de partida
    let timeTextField = getAllByRole('spinbutton', { min: 1, max: 10 });
    fireEvent.change(timeTextField[0], { target: { value: 0 } });
    // comprobamos que no se ha producido el cambio por ser inválido el valor
    // el valor es 4 porque en el anterior test el usuario estableció ese tiempo y se guardó en memoria
    // como su configuración predeterminada
    let timeTextFieldUpdated = getAllByRole('spinbutton', { min: 1, max: 10 });
    expect(timeTextFieldUpdated[0].value).toBe('4');
    expect(getByText('El valor de los minutos debe estar entre 1-20.')).toBeInTheDocument();
    // intentams establecer 25 minutos de duración de partida
    fireEvent.change(timeTextFieldUpdated[0], { target: { value: 25 } });
    // comprobamos que no se ha producido el cambio por ser inválido el valor
    timeTextFieldUpdated = getAllByRole('spinbutton', { min: 1, max: 10 });
    expect(timeTextFieldUpdated[0].value).toBe('4');
    expect(getByText('El valor de los minutos debe estar entre 1-20.')).toBeInTheDocument();

    // intentamos establecer 65 segundos de duración de partida
    timeTextField = getAllByRole('spinbutton', { min: 0, max: 60 });
    fireEvent.change(timeTextField[1], { target: { value: 65 } });
    // comprobamos que no se ha producido el cambio por ser inválido el valor
    timeTextFieldUpdated = getAllByRole('spinbutton', { min: 0, max: 60 });
    expect(timeTextFieldUpdated[1].value).toBe('0');
    expect(getByText('El valor de los segundos debe estar entre 0-60.')).toBeInTheDocument();
    // intentams establecer -1 de duración de partida
    fireEvent.change(timeTextFieldUpdated[1], { target: { value: -1 } });
    // comprobamos que no se ha producido el cambio por ser inválido el valor
    timeTextFieldUpdated = getAllByRole('spinbutton', { min: 0, max: 60 });
    expect(timeTextFieldUpdated[1].value).toBe('0');
    expect(getByText('El valor de los segundos debe estar entre 0-60.')).toBeInTheDocument();
  });

  it('we cant leave all themes unchecked', async () => {
    const { getByText, getByLabelText, queryByText } = render(<GameSettings setSettings={() => {}} currentUser="usuarioPrueba" />);
  
    // nos movemos a la zona de temáticas
    const themesSettingTab = getByText('Temáticas');
    fireEvent.click(themesSettingTab);

    const sportstheme = getByLabelText('Deportes');
    const datestheme = getByLabelText('Fechas históricas');
    const musictheme = getByLabelText('Música');
    const literaturetheme = getByLabelText('Literatura');
    const geotheme = getByLabelText('Geografía');
    // deseleccionamos todos los temas
    fireEvent.click(sportstheme);
    fireEvent.click(datestheme);
    fireEvent.click(musictheme);
    fireEvent.click(literaturetheme);
    fireEvent.click(geotheme);
    // se han desmarcado todos los temas menos el último
    expect(geotheme.checked).toBe(true);
    expect(literaturetheme.checked).toBe(false);
    expect(musictheme.checked).toBe(false);
    expect(datestheme.checked).toBe(false);
    expect(sportstheme.checked).toBe(false);
    // se ha mostrado la advertencia al usuario
    expect(getByText('Cuidado, siempre debe haber al menos un tema seleccionado.')).toBeInTheDocument();
    
    // volvemos a seleccionar "literatura" para que haya dos temas seleccionados
    fireEvent.click(literaturetheme);
    // ya no aparece la advertencia al usuario porque ya ha desistido de deseleccionar todos los temas
    expect(queryByText('Cuidado, siempre debe haber al menos un tema seleccionado.')).toBeNull();
    // intentamos deseleccionar los dos temas que aparecen seleccionados
    fireEvent.click(geotheme);
    fireEvent.click(literaturetheme);
    // se ha desmarcado "geografia" pero no "literatura"
    expect(geotheme.checked).toBe(false);
    expect(literaturetheme.checked).toBe(true);
    // se ha mostrado la advertencia al usuario
    expect(getByText('Cuidado, siempre debe haber al menos un tema seleccionado.')).toBeInTheDocument();
  });
});
