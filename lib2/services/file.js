const path = require('path');
const Promise = require('bluebird');
const fs = require('fs-extra');
const del = require('del');

const generateImageLocationPath = (saveImageLocation, folderName) => {
  return path.join(process.env.PWD, saveImageLocation, folderName);
};

const createImageSaveLocation = async (saveImageLocation, testFolderName) => {
  const imagePath = generateImageLocationPath(
    saveImageLocation,
    testFolderName
  );
  await fs.ensureDirSync(imagePath);
  return imagePath;
};

const prepareImageFolderStructure = async saveImageLocation => {
  try {
    await fs.ensureDirSync(saveImageLocation);
  } catch (e){
    throw new Error(e);
  }
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
  prepareEmptyFolderStructure,
};
