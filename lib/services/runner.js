const Path = require('path');
const Promise = require('bluebird');
const puppeteer = require('puppeteer');
const config = require('./config');
const tests = require('./tests');
const { takeScreenshot } = require('./screenshot');
const { navigateTo, setViewport, hideElements, waitFor } = require('./page');
const { baseImageHref } = require('./file');
const { runImageComparison, hasPassed } = require('./image');

const puppeteerArgs = [config.noSandbox && '--no-sandbox'].filter(arg => !!arg);

const runner = async (tests, runnerFunction) => {
  const browser = await puppeteer.launch({ headless: true, args: puppeteerArgs });
  const page = await browser.newPage();

  const totalFailed = await Promise.mapSeries(
    tests,
    runnerFunction(page)
  ).filter(res => !!res);

  await browser.close();

  return totalFailed;
};

const runnerGenerateBase = page => async (test, testNumber, totalTests) => {
  console.log(
    `Generating base image ${testNumber + 1} of ${totalTests}: `,
    test.title
  );
  const imagePath = Path.join(baseImageHref, `${test.title}.png`);
  try {
    await navigateTo(test, page);
    await setViewport(test, page);
    await hideElements(test.hideElements || [], page);
    await waitFor(config.delay);
    await takeScreenshot(imagePath, page);
  } catch(e) {
    console.log('Unable to run test', e);
  }
};

const runnerRunTests = testImageHref => page => async (
  test,
  testNumber,
  totalTests
) => {
  console.log(`Running test: ${testNumber + 1} of ${totalTests}: `, test.title);
  const imagePath = Path.join(testImageHref, `${test.title}.png`);
  const baseImagePath = Path.join(baseImageHref, `${test.title}.png`);

  try {
    await navigateTo(test, page);
    await setViewport(test, page);
    await hideElements(test.hideElements || [], page);
    await takeScreenshot(imagePath, page);
    const result = await runImageComparison(imagePath, baseImagePath, test);
    return hasPassed(result) ? false : test;
  } catch(e) {
    console.log('Unable to run test', e);
  }
};

const generateBaseImages = async () => {
  await runner(tests.getTransformedTestData(config), runnerGenerateBase);
};

const runTests = async testImageHref => {
  return await runner(
    tests.getTransformedTestData(config),
    runnerRunTests(testImageHref)
  );
};

module.exports = {
  generateBaseImages,
  runTests,
};
