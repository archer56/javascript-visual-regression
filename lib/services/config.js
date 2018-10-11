const path = require('path');
//PWD PROCESS WORKING DIRECTORY;
console.log(process.cwd)
console.log(path.join(__dirname, '../jvr.js'));
try {
  const config = require(path.join(__dirname, '../jvr.js'));
} catch(e) {
  throw new Error('Cannot find config, please ensure that you have created jvr.js');
}

const validateConfig = (config) => {
    if(!config) throw new Error('Cannot find config');
}

if(validateConfig(config)){
  return config;
}
