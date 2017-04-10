#!/usr/bin/env node
var fs = require('fs')
var minimist = require('minimist')
var fasta = require('./')

var argv = minimist(process.argv.slice(2), {
  boolean: ['path', 'file'],
  alias: {
    file: 'f',
    path: 'p'
  }
})

if (argv.help) {
  console.log(
    'Usage: bionode-fasta <options> <fasta file [required]> <output file>\n\n' +
    'You can also use fasta files compressed with gzip\n' +
    'If no output is provided, the result will be printed to stdout\n\n' +
    'Options: -p, --path: Includes the path of the original file as a property of the output objects\n\n'
  )
}

var options = {
  includePath: argv.path,
  filenameMode: argv.file && !argv.write
}

var output = argv._[1] ? fs.createWriteStream(argv._[1]) : process.stdout

var parser = argv.write ? fasta.write() : fasta(options, argv._[0])

parser.pipe(output)

process.stdin.setEncoding('utf8')

if (!process.stdin.isTTY) {
  process.stdin.on('data', function (data) {
    if (data.trim() === '') { return }
    parser.write(data)
  })
  process.stdin.on('end', function () {
    parser.end()
  })
}

process.stdout.on('error', function (err) {
  if (err.code === 'EPIPE') { process.exit(0) }
})
