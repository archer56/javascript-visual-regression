const path = require('path');

const fetchConfigFile = () => {
  const configSrc = path.join(process.env.PWD, 'jvr.js');
  try {
    return require(configSrc);
  } catch (e) {
    throw new Error(
      'Cannot find config, please ensure that you have created jvr.js'
    );
  }
};

const validateConfig = config => {
  return config;
};

const config = fetchConfigFile();

if (!validateConfig(config)) {
  throw new Error(
    'Something went from in jvr.js. Please ensure you are using valid JavaScript'
  );
}

const ben = {
  a: 'a',
  b: 'b',
};

module.exports = config;
