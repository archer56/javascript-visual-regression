const options = require('commander');
const package = require('../../package.json');

options
  .version(package.version, '-v --version')
  .option('-b --generateBase', 'Generate the base images')
  .option('-c --config [uri]', 'Define relative config location')
  .parse(process.argv);

module.exports = options;
