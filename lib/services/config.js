const dir = process.cwd && process.cwd();
const error = require('./error');
const configName ='visualregression.config.json';

const fetchFromProject = () => {
  try{
    return require(`${dir}/${configName}`);
  } catch (e) {
    error.configNotFound(e);
  }
}

module.exports = {
  fetchFromProject
};