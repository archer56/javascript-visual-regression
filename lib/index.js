const path = require("path");
const Promise = require("bluebird");
const puppeteer = require("puppeteer");
const config = require("./services/config");
const options = require("./services/options");
const { takeScreenshot } = require("./services/screenshot");
const { runTests } = require("./services/tests");
const {
  prepareImageFolderStructure,
  generateImageLocationPath,
  prepareTestFolderStructure,
  prepareEmptyFolderStructure
} = require("./services/file");

const prepareBaseImage = (page, { saveLocation }) => async (
  currTest,
  index,
  totalTests
) => {
  console.log(`Running Test ${index + 1} of ${totalTests}: `, currTest.title);
  const imageSaveLocation = path.join(saveLocation, `${currTest.title}.png`);

  try {
    await takeScreenshot(currTest, page, imageSaveLocation);
  } catch (e) {
    console.log(e);
  }
};

const generateBaseImages = async (config, page, saveLocation) => {
  await Promise.mapSeries(
    config.tests,
    prepareBaseImage(page, {
      saveLocation
    })
  );
};

const runAll = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 768 });

  const saveImageLocation = "images";
  await prepareImageFolderStructure(saveImageLocation);

  if (options["generateBase"]) {
    const baseImageLocation = await prepareEmptyFolderStructure(
      saveImageLocation,
      "base"
    );
    await generateBaseImages(config, page, baseImageLocation);
    return await browser.close();
  }

  const baseImageLocation = generateImageLocationPath(
    saveImageLocation,
    "base"
  );
  const testImageLocation = await prepareTestFolderStructure(saveImageLocation);
  await prepareEmptyFolderStructure(saveImageLocation, "results");

  await runTests(config, page, { baseImageLocation, testImageLocation });

  await browser.close();
};

runAll();
