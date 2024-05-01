const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/play-game.feature');

let page;
let browser;

defineFeature(feature, test => {
  const username = "testUserPlayGame"
  const password = "testUserPlayGame"
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
  test('Starts a new game', ({given,when,then}) => {
    given('A logged user in play view', async () => {
        await expect(page).toMatchElement("h1", { text: 'Hola '+ username +'!' });
    });

    when('I press "COMENZAR A JUGAR"', async () => {
        await expect(page).toClick('button', { text: 'COMENZAR A JUGAR' })
    });
    then('A new game starts', async () => {
      await page.waitForTimeout(3000);
      await expect(page).toMatchElement("h1", { text: 'Pregunta Número 1' });
    });
  });


  test('Results are shown', ({given,when,then}) => {
    let buttonColor;
    given('A logged user in a game', async () => {
      await expect(page).toClick('button', { text: 'COMENZAR A JUGAR' })
    });
    when('I choose an option', async () => {
      buttonColor = await page.waitForSelector('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root').backgroundColor;
      await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
    });
    then('Show results', async () => {
      const changedButton = await page.waitForSelector('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root').backgroundColor 
      !== buttonColor;
      expect(changedButton).toBe(true);
    });
  });


  test('Shows the next questions',({given,when,then})=>{
    given('A logged user in a game',async()=>{
        await expect(page).toClick('button', { text: 'COMENZAR A JUGAR' })
    });
    when('I choose an option',async()=>{
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
    });
    then('New Question appears',async()=>{
      await expect(page).toMatchElement("h1", { text: 'Pregunta Número 2' });
    });
  });

  test('Finish the game',({given,when,then})=>{
    given('A logged user in a game',async()=>{
        await expect(page).toClick('button', { text: 'COMENZAR A JUGAR' })
    });
    when('I play until the game ends',async()=>{
        await expect(page).toMatchElement("h1", { text: 'Pregunta Número 1' });
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        r(() => expect(pagawait waitFoe).toMatchElement("h1", { text: 'Pregunta Número 2' }));
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(page).toMatchElement("h1", { text: 'Pregunta Número 3' }));
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(page).toMatchElement("h1", { text: 'Pregunta Número 4' }));
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(page).toMatchElement("h1", { text: 'Pregunta Número 5' }));
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(page).toMatchElement("h1", { text: 'Pregunta Número 6' }));
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(page).toMatchElement("h1", { text: 'Pregunta Número 7' }));
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(page).toMatchElement("h1", { text: 'Pregunta Número 8' }));
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(page).toMatchElement("h1", { text: 'Pregunta Número 9' }));
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        await waitFor(() => expect(page).toMatchElement("h1", { text: 'Pregunta Número 10' }));
        await expect(page).toClick('.MuiGrid-root:nth-child(1) > .MuiButtonBase-root')
        
    });
    then('The game is finished',async()=>{
        await expect(page).toMatchElement("h6", { text: '¡Gracias por jugar!' });
    });
  })
});