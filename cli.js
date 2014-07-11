#!/usr/bin/env node
var fs = require('fs')
var path = require('path')
var bionodeFasta = require('./')

var args = process.argv.slice(2)

if(args.length < 1){
  process.stdout.write('Not enough arguments used. Check function usage.\n')
  process.exit(1)
}

fs.readFile(path.resolve(args[1]), function (err, data) {
  if (err) throw err
  var bionodeOutput = bionodeFasta[args[0]](data, args[3], args[4])
  process.stdout.write(JSON.stringify(bionodeOutput) + '\n')
});