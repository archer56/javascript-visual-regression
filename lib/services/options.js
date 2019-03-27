const options = require('commander');
const package = require('../../package.json');

options
  .version(package.version)
  .option('-b --generateBase', 'Generate the base images')
  .parse(process.argv);


module.exports = options;
