const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const del = require('del');

const generateImageLocationPath = (saveImageLocation, folderName) => {
  return path.join(process.env.PWD, saveImageLocation, folderName);
};

const createImageSaveLocation = async (saveImageLocation, testFolderName) => {
  const imagePath = generateImageLocationPath(
    saveImageLocation,
    testFolderName
  );
  await fs.mkdirAsync(imagePath);
  return imagePath;
};

const prepareImageFolderStructure = async saveImageLocation => {
  const fileExists = fs.existsSync(saveImageLocation);
  if (!fileExists) await fs.mkdirAsync(saveImageLocation);
};

const prepareEmptyFolderStructure = async (saveImageLocation, folderName) => {
  const fileExists = fs.existsSync(
    generateImageLocationPath(saveImageLocation, folderName)
  );

  if (!fileExists)
    return createImageSaveLocation(saveImageLocation, folderName);

  const imageLocation = generateImageLocationPath(
    saveImageLocation,
    folderName
  );
  del.sync([`${imageLocation}/**`, `!${imageLocation}`]);
  return imageLocation;
};

const prepareTestFolderStructure = async saveImageLocation => {
  const testFolderName = new Date().toISOString();
  await createImageSaveLocation(saveImageLocation, testFolderName);
  return generateImageLocationPath(saveImageLocation, testFolderName);
};

module.exports = {
  prepareImageFolderStructure,
  generateImageLocationPath,
  prepareTestFolderStructure,
  prepareEmptyFolderStructure
}
