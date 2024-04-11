const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/login-form.feature');

let page;
let browser;

defineFeature(feature, test => {
  
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
  });

  test('An user logs in with valid credentials', ({given,when,then}) => {
    
    let username;
    let password;

    given('An user is in the login page', async () => {
      username = "jesus"
      password = "jesus"
    });

    when('I fill the data in the form and press submit', async () => {
        await driver.findElement(By.id(":r0:")).click()
        await driver.findElement(By.id(":r0:")).sendKeys(username)
        await driver.findElement(By.id(":r1:")).click()
        await driver.findElement(By.id(":r1:")).sendKeys(password)
        await driver.findElement(By.css(".MuiButtonBase-root")).click()
    });

    then('A confirmation message should be shown in the screen', async () => {
        await expect(getByText('Hola jesus!')).toBeInTheDocument();
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});