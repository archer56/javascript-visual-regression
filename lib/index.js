const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const puppeteer = require('puppeteer');
const BlinkDiff = require('blink-diff');
const config = require('./services/config');

const createImageSaveLocation = async (saveImageLocation, testFolderName) => {
  await fs.mkdirAsync(path.join(process.env.PWD, saveImageLocation, testFolderName));
}

const runTest = (page, options) => async (test) => {
  console.log('Running Test ', test.title)
  const baseImageSrc = path.join(process.env.PWD, options.saveImageLocation, options.testFolderName, `${test.title}.png`);
  const testImageSrc = path.join(process.env.PWD, options.saveImageLocation, options.testFolderName, `${test.title}.png`);
  await page.goto(test.url);
  await page.screenshot({path: testImageSrc, fullPage: true});

  var diff = new BlinkDiff({
    imageAPath: baseImageSrc, // Use file-path
    imageBPath: testImageSrc,

    thresholdType: BlinkDiff.THRESHOLD_PERCENT,
    threshold: config.comparisonTolerance || 0.1,

    imageOutputPath: path.join(process.env.PWD, `${test.title}.png`),
    imageOutputLimit: BlinkDiff.OUTPUT_DIFFERENT,
  });

  diff.run((error, results) => {
    console.log('error', error)
    console.log('res - ', results)
  })

}

const runAll = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  const saveImageLocation = 'images';
  const testFolderName = new Date().toISOString();
  await createImageSaveLocation(saveImageLocation, testFolderName)

  await Promise.mapSeries(config.tests, runTest(page, {
    saveImageLocation,
    testFolderName
  }));

  await browser.close();
}

runAll();
