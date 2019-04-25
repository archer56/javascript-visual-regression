const fs = require('fs-extra');
const path = require('path');
const config = require('./config');
const { BASE_IMAGE_NAME, RESULTS_IMAGE_NAME } = require('../constants');

const imageLocationPath = folderName => path.join(process.env.PWD, config.saveImageLocation, folderName);

const baseImageHref = imageLocationPath(BASE_IMAGE_NAME);
const resultsImageHref = imageLocationPath(RESULTS_IMAGE_NAME);

const createBaseFolder = () => {
  fs.emptyDirSync(baseImageHref);
};

const createTestImageFolder = () => {
  const testFolderName = imageLocationPath(new Date().toISOString());

  fs.ensureDirSync(testFolderName);
  return testFolderName;
};

const createResultsFolder = () => {
  fs.emptyDirSync(resultsImageHref);
};

module.exports = {
  createBaseFolder,
  createTestImageFolder,
  createResultsFolder,
  baseImageHref,
  resultsImageHref
};
