#!/usr/bin/env node
require('./babel.js');
const Config = require('./services/config');
const package = require('../package.json');
const config = Config.fetchFromProject();

console.log(config)