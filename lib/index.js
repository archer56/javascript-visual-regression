const path = require('path');
const Promise = require('bluebird');
const del = require('del');
const fs = Promise.promisifyAll(require("fs"));
const puppeteer = require('puppeteer');
const BlinkDiff = require('blink-diff');
const config = require('./services/config');
const options = require('./services/options');


const getImageLocationPath = (saveImageLocation, folderName) => {
  return path.join(process.env.PWD, saveImageLocation, folderName);
}

const createImageSaveLocation = async (saveImageLocation, testFolderName) => {
  const imagePath = getImageLocationPath(saveImageLocation, testFolderName);
  await fs.mkdirAsync(imagePath);
  return imagePath;
}

const runImageComparison = async (imageA, imageB, test) => {
  try {
    const imageDifference = new BlinkDiff({
      imageAPath: imageA,
      imageBPath: imageB,

      thresholdType: BlinkDiff.THRESHOLD_PERCENT,
      threshold: config.comparisonTolerance === 0 ? 0 : config.comparisonTolerance || 0.1,

      imageOutputPath: path.join(process.env.PWD, 'images/results', `${test.title}.png`),
      imageOutputLimit: BlinkDiff.OUTPUT_DIFFERENT,
    });

    const imageResult = await imageDifference.runWithPromise();
    return { imageDifference, imageResult };

  } catch (e) {
    throw new Error(`Failed, could not compare screenshot, ensure that the base image exists`);
  }
};

const takeScreenshot = async (currTest, page, imageSaveLocation) => {
  try {
    await page.goto(currTest.url);
  } catch {
    throw new Error(`Failed, could not load ${currTest.url}`);
  }
  await page.screenshot({path: imageSaveLocation, fullPage: true});
};

const prepareBaseImage = (page, { saveLocation  }) => async (currTest, index, totalTests) => {
  console.log(`Running Test ${index + 1} of ${totalTests}: `, currTest.title)
  const imageSaveLocation = path.join(saveLocation, `${currTest.title}.png`);

  try {
    await takeScreenshot(currTest, page, imageSaveLocation);
  } catch (e) {
    console.log(e);
  }
}

const generateBaseImages = async (config, page, saveLocation) => {
  await Promise.mapSeries(config.tests, prepareBaseImage(page, {
    saveLocation,
  }));
}

const runTest = (page, { baseImageLocation, testImageLocation }) => async (currTest, index, totalTests) => {
  console.log(`Running Test ${index + 1} of ${totalTests}: `, currTest.title)
  const testImageSaveLocation = path.join(testImageLocation, `${currTest.title}.png`);
  const baseImageComparisonLocation = path.join(baseImageLocation, `${currTest.title}.png`);

  try {
    await takeScreenshot(currTest, page, testImageSaveLocation);
    const { imageResult, imageDifference } = await runImageComparison(testImageSaveLocation, baseImageComparisonLocation, currTest);

    if(imageDifference.hasPassed(imageResult.code)) {
      return console.log('\x1b[32m', `Passed with ${imageResult.differences} differences`, '\x1b[37m');
    } else {
      return console.log('\x1b[31m', `Failed with ${imageResult.differences} differences`, '\x1b[37m');
    }
  } catch (e) {
    console.log(e);
  }
}

const runTests = async (config, page, locations) => {
  await Promise.mapSeries(config.tests, runTest(page, locations));
};

const prepareImageFolderStructure = async (saveImageLocation) => {
  const fileExists = fs.existsSync(saveImageLocation);
  if(!fileExists) await fs.mkdirAsync(saveImageLocation);
}

const prepareEmptyFolderStructure = async (saveImageLocation, folderName) => {
  const fileExists = fs.existsSync(getImageLocationPath(saveImageLocation, folderName));

  if(!fileExists) return createImageSaveLocation(saveImageLocation, folderName);

  const imageLocation = getImageLocationPath(saveImageLocation, folderName);
  del.sync([`${imageLocation}/**`, `!${imageLocation}`]);
  return imageLocation;
}

const prepareTestFolderStructure = async (saveImageLocation) => {
  const testFolderName = new Date().toISOString();
  await createImageSaveLocation(saveImageLocation, testFolderName)
  return getImageLocationPath(saveImageLocation, testFolderName);
}

const runAll = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 768 });

  const saveImageLocation = 'images';
  await prepareImageFolderStructure(saveImageLocation);

  if(options['generateBase']) {
    const baseImageLocation = await prepareEmptyFolderStructure(saveImageLocation, 'base');
    await generateBaseImages(config, page, baseImageLocation);
    return await browser.close();
  }

  const baseImageLocation = getImageLocationPath(saveImageLocation, 'base');
  const testImageLocation = await prepareTestFolderStructure(saveImageLocation);
  await prepareEmptyFolderStructure(saveImageLocation, 'results');

  await runTests(config, page, {baseImageLocation, testImageLocation});

  await browser.close();
}

runAll();
