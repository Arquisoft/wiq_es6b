const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/settings.feature');

let page;
let browser;

defineFeature(feature, test => {
  const username = "testUserSettings"
  const password = "testUserSettings"
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 1 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
    await expect(page).toClick("button", { text: "¿No tienes cuenta? Registrate aqui." });
    await expect(page).toFill('input[name="username"]', username);
    await expect(page).toFill('input[name="password"]', password);
    await expect(page).toClick('button', { text: 'Añadir usuario' })
    await page.waitForNavigation();
  });
  beforeEach(async()=>{
    await page
        .goto("http://localhost:3000", {
          waitUntil: "networkidle0",
        })
        .catch(() => {});
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick('button', { text: 'Iniciar sesión' })
  });
  afterAll(async ()=>{
    browser.close();
  });


  test('A registered user changes the number of questions in the game', ({given,when,then}) => {
    given('A registered user in the settings view', async () => {
        await expect(page).toClick('button', { text: 'AJUSTES DE PARTIDA' });
    });

    when('I change the game settings to 5 questions', async () => {
        await page.waitForSelector('.MuiSlider-root');
        changeSliderValueTo5();
    });
    then('the game settings should be updated', async () => {
        await expect(page).toClick('button', { text: 'JUGAR' });
        await expect(page).toClick('button', { text: 'COMENZAR A JUGAR' })
        await expect(getByText('Pregunta Número 1')).toBeInTheDocument();
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(getByText('Pregunta Número 2')).toBeInTheDocument());
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(getByText('Pregunta Número 3')).toBeInTheDocument());
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(getByText('Pregunta Número 4')).toBeInTheDocument());
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(getByText('Pregunta Número 5')).toBeInTheDocument());
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await expect(getByText('¡Gracias por jugar!')).toBeInTheDocument();
    });
  });

  test('A registered user changes the time limit in the game', ({given,when,then}) => {
      given('A registered user in the settings view', async () => {
          await expect(page).toClick('button', { text: 'AJUSTES DE PARTIDA' });
      });
    
      when('I change the game settings to 5:30 minutes', async () => {
          await expect(page).toClick('button', { text: 'DURACIÓN DE PARTIDA' });
          await expect(page).toFill('input[name="Minutos"]', 5);
          await expect(page).toFill('input[name="Segundos"]', 30);
      });
      then('the game settings should be updated', async () => {
          await expect(page).toClick('button', { text: 'JUGAR' });
          await expect(page).toClick('button', { text: 'COMENZAR A JUGAR' })
          await expect(getByText('¡Tiempo restante 05:30!')).toBeInTheDocument();
      });

  });

  async function changeSliderValueTo5() {
    const slider = await page.$('.MuiSlider-root');

    const sliderRect = await slider.boundingBox();

    const sliderMidX = sliderRect.x + sliderRect.width / 2;
    const sliderMidY = sliderRect.y + sliderRect.height / 2;

    const initialValue = 10;
    const targetValue = 5;
    const steps = (initialValue - targetValue) / 5;

    await page.mouse.move(sliderMidX, sliderMidY);
    await page.mouse.down();
    for (let i = 0; i < steps; i++) {
        await page.mouse.move(sliderMidX - 50, sliderMidY, { steps: 10 });
    }
    await page.mouse.up();
  }
});

