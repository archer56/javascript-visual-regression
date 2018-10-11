const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const puppeteer = require('puppeteer');
const config = require('./services/config');

const createImageSaveLocation = async (saveImageLocation) => {
  fs.mkdirAsync(path.join(process.env.PWD, saveImageLocation));
}

const runTest = (page, options) => async (test) => {
  console.log('Running Test ', test.title)
  const saveLoc = path.join(process.env.PWD, options.saveImageLocation, `${test.title}.png`);
  await page.goto(test.url);
  await page.screenshot({path: saveLoc, fullPage: true});
}

const runAll = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await createImageSaveLocation('images')

  await Promise.mapSeries(config.tests, runTest(page, {
    saveImageLocation: 'images'
  }));

  await browser.close();
}

runAll();
