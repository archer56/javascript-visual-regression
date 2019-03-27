const BlinkDiff = require('blink-diff');
const { DEFAULT_COMPARISON_TOLERANCE } = require('../constants');
const config = require('./config');
const path = require('path');

const runImageComparison = async (imageA, imageB, test) => {
  try {
    const imageDifference = new BlinkDiff({
      imageAPath: imageA,
      imageBPath: imageB,

      thresholdType: BlinkDiff.THRESHOLD_PERCENT,
      threshold:
        config.comparisonTolerance === 0
          ? 0
          : config.comparisonTolerance || DEFAULT_COMPARISON_TOLERANCE,

      imageOutputPath: path.join(
        process.env.PWD,
        'images/results',
        `${test.title}.png`
      ),
      imageOutputLimit: BlinkDiff.OUTPUT_DIFFERENT,
    });

    const imageResult = await imageDifference.runWithPromise();
    return { imageDifference, imageResult };
  } catch (e) {
    console.log(e);
    throw new Error(
      `Failed, could not compare screenshot, ensure that the base image exists`
    );
  }
};

module.exports = {
  runImageComparison,
};
