const path = require('path');
const BlinkDiff = require('blink-diff');
const config = require('./config');
const { resultsImageHref } = require('./file');


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
        resultsImageHref,
        `${test.title}.png`
      ),
      imageOutputLimit: BlinkDiff.OUTPUT_DIFFERENT,
    });

    const imageResult = await imageDifference.runWithPromise();
    return { imageDifference, imageResult };
  } catch (e) {
    console.log(e);
    throw new Error(
      `Failed, could not compare screenshot, ensure that the base image exists at`
    );
  }
};

const hasPassed = ({ imageResult, imageDifference }) => {
  const percentageDiff = `${(imageResult.differences / imageResult.dimension * 100).toFixed(2)}%`;
  if (imageDifference.hasPassed(imageResult.code)) {
    console.log(
      '\x1b[32m',
      `Passed with ${percentageDiff} differences`,
      '\x1b[37m'
    );
    return true;
  } else {
    console.log(
      '\x1b[31m',
      `Failed with ${percentageDiff} differences`,
      '\x1b[37m'
    );
    return false;
  }
}

module.exports = {
  runImageComparison,
  hasPassed,
};
