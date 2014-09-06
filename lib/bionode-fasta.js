// # bionode-fasta
// > Streamable FASTA parser.
// >
// > doi: [?](?)
// > author: [Bruno Vieira](http://bmpvieira.com)
// > email: <mail@bmpvieira.com>
// > license: [MIT](https://raw.githubusercontent.com/bionode/bionode-fasta/master/LICENSE)
//
// ---
//
// ## Usage
// This module can be used in Node.js as described further below, or as a command line tool.
// Examples:
//
//     $ npm install -g bionode-fasta
//
//     # bionode-fasta [options] [input file] [output file]
//     $ bionode-fasta input.fasta.gz output.json
//
//     # You can also use fasta files compressed with gzip
//     # If no output is provided, the result will be printed to stdout
//     # Options: -p, --path: Includes the path of the original file as a property of the output objects

var fs = require('fs')
var zlib = require('zlib')
var through = require('through2')
var pumpify = require('pumpify')
var concat = require('concat-stream')
var fastaParser = require('fasta-parser')

// ## Fasta
// Returns a Writable Stream that parses a FASTA content Buffer into a JSON Buffer
//
//     var fasta = require('bionode-fasta')
//
//     fs.createReadStream('./input.fasta')
//     .pipe(fasta())
//     .pipe(process.stdout)
//
//     => { "id": "contig1",
//          "seq": "AGTCATGACTGACGTACGCATG" }
//     => { "id": "contig2",
//          "seq": "ATGTACGTACTGCATGC" }
//     => [...]
//
// Can also parse content from filenames Strings streamed to it
//
//     fs.createReadStream('./fasta-list.txt')
//     .pipe(split())
//     .pipe(fasta({filenameMode: true}))
//     .pipe(process.stdout)
//
// When filenames are Streamed like in the previous example, or passed directly
// to the parser Stream, they can be added to the output Objects
//
//     fasta({includePath: true}, './input.fasta')
//     .pipe(process.stdout)
//
//     => { "id": "contig1",
//          "seq": "AGTCATGACTGACGTACGCATG" }
//          "path": "./input.fasta" }
//
// The output from the parser can also be available as Objects instead of Buffers
//
//     fasta({objectMode: true}, './input.fasta')
//     .on('data', console.log)
//
// Shortcut version of previous example
//
//     fasta.obj('./input.fasta').on('data', console.log)
//
// Callback style can also be used, however they might not be the best for large files
//
//     fasta.obj('./input.fasta', function(data) {
//       console.log(data)
//     })

module.exports = fasta

module.exports.obj = function(arg1, arg2, arg3) {
  var params = paramsParser(arg1, arg2, arg3)
  params.options.objectMode = true
  var stream = fasta(params.options, params.filename, params.callback)
  return stream
}

module.exports.write = function() {
  var stream = through.obj(transform)
  return stream

  function transform(obj, enc, next) {
    try {
      obj = JSON.parse(obj)
      var fastaString = '>'+obj.id+'\n' + obj.seq.match(/.{1,80}/g).join('\n')+'\n'
      this.push(fastaString)
    }
    catch(e) {}
    next()
  }
}

function fasta(arg1, arg2, arg3) {
  var self = this
  var params = paramsParser(arg1, arg2, arg3)

  var jsparse
  var contentParser
  if (params.options.objectMode) {
    contentParser = pumpify.obj(fastaParser(), jsParse())
  }
  else {
    contentParser = fastaParser()
  }

  var filesParser = through.obj(transform)
  function transform(obj, enc, next){
    var self = this
    var unzip = 'gz' === obj.split('.').pop() ? zlib.Gunzip() : through()
    var includepath = params.options.includePath ? includePath(obj) : through()

    var jsparse, pumpit
    if (params.options.objectMode) {
      jsparse =  jsParse()
      pumpit = pumpify.obj
    }
    else {
      jsparse = through()
      pumpit = pumpify
    }

    var pipeline = pumpit(
      fs.createReadStream(obj),
      unzip,
      fastaParser(),
      includepath,
      jsparse
    )

    pipeline
    .on('error', function(error) { self.emit('error', error) })
    .on('data', function(data) { self.push(data) })
    .on('end', function() { self.push(null) })

    next()
  }

  stream = params.filename || params.options.filenameMode ? filesParser : contentParser
  if (params.filename) { stream.write(params.filename) }
  if (params.callback) {
    stream.on('error', params.callback)
    stream.pipe(concat(function(data) { params.callback(null, data) }))
  }

  return stream
}


function includePath(path) {
  var stream = through(transform)
  return stream
  function transform(buf, enc, next) {
    var openEnd = buf.slice(0, buf.length-2)
    var pathBuf = new Buffer(',"path":"' + path + '"}\n')
    var totalLen = buf.length-2 + pathBuf.length
    var newBuf = Buffer.concat([openEnd, pathBuf], totalLen)
    this.push(newBuf)
    next()
  }
}


function jsParse() {
  var stream = through.obj(transform, flush)
  return stream
  function transform(obj, enc, next) {
    if (typeof obj === 'Buffer') { obj = obj.toString() }
    JSON.parse(obj)
    this.push(JSON.parse(obj))
    next()
  }
  function flush() { this.push(null) }
}

function paramsParser(arg1, arg2, arg3) {
  var params = {}
  if (typeof arg1 === 'object') {
    params.options = arg1
    if (typeof arg2 === 'string') {
      params.filename = arg2
      if (typeof arg3 === 'function') {
        params.callback = arg3
      }
    }
  }
  else if (typeof arg1 === 'string') {
    params.options = {}
    params.filename = arg1
    if (typeof arg2 === 'function') {
      params.callback = arg2
    }
  }
  else {
    params.options = {}
  }
  return params
}
