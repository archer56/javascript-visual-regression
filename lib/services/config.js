const dir = process.cwd && process.cwd();
const error = require('./error');
const configName ='visualregression.config.js';

const fetchFromProject = () => {
  try{
    const configFile = require(`${dir}/${configName}`);
    return configFile.config;
  } catch (e) {
    console.error(e);
    error.configNotFound(e);
  }
}

module.exports = {
  fetchFromProject
};