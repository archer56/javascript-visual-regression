const options = require('commander');

options
  .option('-b --generateBase', 'Generate the base images')
  .option('--blah', 'Generate the base images')
  .parse(process.argv);


module.exports = options;
