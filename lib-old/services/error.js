#!/usr/bin/env node
const defaultError = 'Find out more at: \'https://github.com/archer56/react-visual-regression\'';

const configNotFound = (e) => {
  throw new Error(`Could not find config, make sure you calling this from the project root and there is a config file. ${defaultError}`);
}

module.exports = {
  configNotFound
};