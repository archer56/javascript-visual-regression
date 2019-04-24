const path = require('path');
const options = require('./options');

const defaultConfig = {
  saveImageLocation: '.images',
  comparisonTolerance: 0.05,
}

const fetchConfigFile = () => {
  const location = options['config'] || 'jvr.config.js';
  const configSrc = path.join(process.env.PWD, location);

  try {
    const userConfig = require(configSrc);
    return {
      ...defaultConfig,
      ...userConfig,
    };
  } catch (e) {
    throw new Error(
      `Cannot find config at "${configSrc}", please ensure that you have created jvr.config.js`
    );
  }
};

module.exports = fetchConfigFile();
