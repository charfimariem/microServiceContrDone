// seleniumTest.js

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai'); // Utilisation de Chai pour les assertions

describe('Selenium Test', () => {
  let driver;

  beforeAll(async () => {
    // Configuration du navigateur Chrome
    const options = new chrome.Options();
    // options.addArguments("--headless"); // Pour exécuter les tests en mode headless (sans interface graphique)
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Should navigate to a webpage and perform actions', async () => {
    // Ouvrir une URL
    await driver.get('http://localhost:5050'); // Remplacez par l'URL de votre application
    
    // Attendre que certains éléments chargent (par exemple, un élément avec l'ID 'content')
    await driver.wait(until.elementLocated(By.id('content')), 10000);

    // Effectuer des actions (par exemple, saisir du texte dans un champ de formulaire)
    await driver.findElement(By.name('q')).sendKeys('Hello, Selenium!', Key.RETURN);

    // Attendre que les résultats de la recherche se chargent (par exemple, un élément avec l'ID 'search-results')
    await driver.wait(until.elementLocated(By.id('search-results')), 10000);

    // Vérifier quelque chose sur la page
    const title = await driver.getTitle();
    expect(title).to.contain('Search Results');
  });
});
