const Promise = require('bluebird');
const path = require('path');
const { takeScreenshot } = require('./screenshot');
const { runImageComparison } = require('./image');

const runTest = (page, { baseImageLocation, testImageLocation }) => async (
  currTest,
  index,
  totalTests
) => {
  console.log(`Running Test ${index + 1} of ${totalTests}: `, currTest.title);
  const testImageSaveLocation = path.join(
    testImageLocation,
    `${currTest.title}.png`
  );
  const baseImageComparisonLocation = path.join(
    baseImageLocation,
    `${currTest.title}.png`
  );

  try {
    await takeScreenshot(currTest, page, testImageSaveLocation);
    const { imageResult, imageDifference } = await runImageComparison(
      testImageSaveLocation,
      baseImageComparisonLocation,
      currTest
    );

    if (imageDifference.hasPassed(imageResult.code)) {
      return console.log(
        '\x1b[32m',
        `Passed with ${imageResult.differences} differences`,
        '\x1b[37m'
      );
    } else {
      return console.log(
        '\x1b[31m',
        `Failed with ${imageResult.differences} differences`,
        '\x1b[37m'
      );
    }
  } catch (e) {
    console.log(e);
  }
};

const runTests = async (config, page, locations) => {
  await Promise.mapSeries(config.tests, runTest(page, locations));
};

module.exports = {
  runTests,
};
