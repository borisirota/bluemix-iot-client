#!/usr/bin/env node

var program = require('commander');
var BluemixIotClient = require('..');

program
  .version('1.0.0')
  .option('-o, --org <string>', 'org')
  .option('-d, --id <string>', 'id')
  .option('-t, --type <string>', 'type')
  .option('-m, --method <string>', 'method')
  .option('-k, --token <string>', 'token')
  .option('-p, --path <string>', 'config file path')
  .option('-i, --interval <number>', 'interval', 1000)
  .parse(process.argv);

BluemixIotClient(program.path, {
    "org": program.org,
    "id": program.id,
    "type": program.type,
    "auth-method": program.method,
    "auth-token": program.token
}, program.interval);