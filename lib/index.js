const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const puppeteer = require('puppeteer');
const BlinkDiff = require('blink-diff');
const config = require('./services/config');

const createImageSaveLocation = async (saveImageLocation, testFolderName) => {
  await fs.mkdirAsync(path.join(process.env.PWD, saveImageLocation, testFolderName));
}

const runTest = (page, options) => async (test, index, totalTests) => {
  console.log(`Running Test ${index} of ${totalTests}: `, test.title)
  const baseImageSrc = path.join(process.env.PWD, options.saveImageLocation, 'base', `${test.title}.png`);
  const testImageSrc = path.join(process.env.PWD, options.saveImageLocation, options.testFolderName, `${test.title}.png`);
  try {
    await page.goto(test.url);
  } catch {
    return console.log('\x1b[31m', `Failed, could not load ${test.url}`, '\x1b[37m');
  }
  await page.screenshot({path: testImageSrc, fullPage: true});

  let diff = null;
  let res = null;

  try {
    diff = new BlinkDiff({
      imageAPath: baseImageSrc,
      imageBPath: testImageSrc,

      thresholdType: BlinkDiff.THRESHOLD_PERCENT,
      threshold: config.comparisonTolerance === 0 ? 0 : config.comparisonTolerance || 0.1,

      imageOutputPath: path.join(process.env.PWD, 'images/results', `${test.title}.png`),
      imageOutputLimit: BlinkDiff.OUTPUT_DIFFERENT,
    });

    res = await diff.runWithPromise();
  } catch (e) {
    return console.log('\x1b[31m', `Failed, could not take screenshot, ensure that the base image exists`, '\x1b[37m');
  }

  if(diff.hasPassed(res.code)) {
    return console.log('\x1b[32m', `Passed with ${res.differences} differences`, '\x1b[37m');
  } else {
    return console.log('\x1b[31m', `Failed with ${res.differences} differences`, '\x1b[37m');
  }
}

const runAll = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 768 });

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
