#!/usr/bin/env node

var program = require('commander');
var BluemixIotClient = require('..');

program
  .version('1.0.0')
  .option('-p, --path <string>', 'absolute path to config file of the device. check the format here: https://docs.internetofthings.ibmcloud.com/nodejs/node-js_devices.html#/using-a-configuration-file#using-a-configuration-file')
  .option('-i, --interval <number>', 'interval between publishing events', 1000)
  .option('-c, --checksum', 'flag indicates whether to check the data with checksum or not. if yes, the format of the data should be DATA|CHECKSUM')
  .parse(process.argv);

BluemixIotClient(program.path, program.interval, program.checksum);