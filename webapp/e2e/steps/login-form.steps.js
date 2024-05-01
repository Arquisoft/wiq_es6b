const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/login-form.feature');

let page;
let browser;

defineFeature(feature, test => {
  const username = "testUserLogin"
  const password = "testUserLogin"
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    //Way of setting up the timeout
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
  });

  test('An user logs in with valid credentials', ({given,when,then}) => {

    let username;
    let password;

    given('An user is in the login page', async () => {
      username = "testUserLogin"
      password = "testUserLogin"
    });

    when('I fill the data in the form and press submit', async () => {
        await expect(page).toClick("button", { text: "¿Ya tienes cuenta? Inicia sesión aqui." });
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick('button', { text: 'Iniciar sesión' })
    });

    then('The user should be redirected to the home page', async () => {
      await expect(page).toMatchElement("h5", { text: `Hola ${username}!` });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});