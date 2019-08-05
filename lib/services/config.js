const path = require('path');
const options = require('./options');

const { DEFAULT_SCREENWIDTHS } = require('../constants');

const defaultConfig = {
  saveImageLocation: '.images',
  comparisonTolerance: 0.05,
  tests: [],
  screenWidths: DEFAULT_SCREENWIDTHS,
  noSandbox: false, 
  delay: 0,
};

const fetchConfigFile = () => {
  const location = options.config || 'jvr.config.js';
  const configSrc = path.join(process.env.PWD, location);

  try {
    const userConfig = require(configSrc);
    return {
      ...defaultConfig,
      ...userConfig,
    };
  } catch (e) {
    throw new Error(
      `${e}. Cannot find config at "${configSrc}", please ensure that you have created jvr.config.js.`
    );
  }
};

module.exports = fetchConfigFile();
