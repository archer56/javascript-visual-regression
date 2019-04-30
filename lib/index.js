const options = require('./services/options');
const file = require('./services/file');
const config = require('./services/config');
const runner = require('./services/runner');

const initialiseDirectory = () => {
  if (options.generateBase) {
    file.createBaseFolder();
  } else {
    file.createResultsFolder();
    return file.createTestImageFolder();
  }
};

const runJvr = async (testImageHref) => {
  if(options.generateBase) {
    await runner.generateBaseImages();
  } else {
    const failingTests = await runner.runTests(testImageHref);
    if(failingTests.length > 0) {
      console.log('TEST SUITE FAILED, check results folder for more information', file.resultsImageHref);
      process.exit(1);
    }

  }
}

try {
  const testImageHref = initialiseDirectory();
  runJvr(testImageHref);
} catch(e) {
  console.log('ugh oh, something went wrong..', e);
}
