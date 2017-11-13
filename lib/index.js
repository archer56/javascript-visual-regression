#!/usr/bin/env node
const Config = require('./services/config');
const package = require('../package.json');
const config = Config.fetchFromProject();

console.log(config)