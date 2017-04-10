var fs = require('fs')
var test = require('tape')
var request = require('request')
var async = require('async')
var fasta = require('../')
var data = require('./data')

// Node.js fs is implemented in the browser by browserify-fs using leveldb.
// So we need to fetch the file and save it locally (server) or in leveldb (client) with fs.
// Because Cross-Origin Resource Sharing (CORS) isn't enabled on GitHub, we need
// to use a proxy to access the file.

async.eachSeries(['test.fasta', 'test.fasta.gz'], download, startTests)

function download (file, callback) {
  var proxy = 'http://cors.inb.io/'
  var rooturl = 'https://raw.githubusercontent.com/bionode/bionode-fasta/master/test/'
  fs.mkdir('test', gotDir)
  function gotDir () {
    var get = request(proxy + rooturl + file, {encoding: null})
    var write = fs.createWriteStream('test/' + file)
    get.pipe(write)
    write.on('close', callback)
  }
}

function startTests () {
  test('Read a fasta file and pipe content to parser.', function (t) {
    t.plan(3)
    var msg

    msg = 'should return a Buffer for each sequence'
    testPipeParser(msg, fasta(), true)

    msg = 'should return an Object for each sequence'
    testPipeParser(msg, fasta({ objectMode: true }))

    msg = 'should return an Object for each sequence (shortcut version)'
    testPipeParser(msg, fasta.obj())

    function testPipeParser (msg, parser, jsparse) {
      var result = []

      fs.createReadStream('test/test.fasta')
      .pipe(parser)
      .on('data', pushResult)
      .on('end', function () { t.deepEqual(result, data.fasta, msg) })

      function pushResult (data) {
        if (jsparse) { data = JSON.parse(data.toString()) }
        result.push(data)
      }
    }
  })

  testFilename('test/test.fasta')
  testFilename('test/test.fasta.gz')
  testFilename('test/test.fasta', true)
  testFilename('test/test.fasta.gz', true)

  function testFilename (file, includePath) {
    var solution = JSON.parse(JSON.stringify(data.fasta))
    var extramsg = ''

    if (includePath) {
      extramsg = ' (add path to results)'
      solution.forEach(addPath)
    }

    function addPath (obj, i) {
      obj.path = file
      solution[i] = obj
    }

    if (file.split('.').pop() === 'gz') {
      extramsg += ' (read gzipped file)'
    }

    test('Use parser to read file by passing filename' + extramsg, function (t) {
      t.plan(3)
      var msg
      var parser

      msg = 'should return a Buffer for each sequence'
      parser = includePath ? fasta({ includePath: true }, file) : fasta(file)
      testFilenamePipe(msg, parser, true)

      msg = 'should return an Object for each sequence'
      var options = { objectMode: true }
      if (includePath) { options.includePath = true }
      parser = fasta(options, file)
      testFilenamePipe(msg, parser)

      msg = 'should return an Object for each sequence (shortcut version)'
      parser = includePath ? fasta.obj({ includePath: true }, file) : fasta.obj(file)
      testFilenamePipe(msg, parser)

      function testFilenamePipe (msg, parser, jsparse) {
        var result = []
        parser
        .on('data', pushResult)
        .on('end', function () { t.deepEqual(result, solution, msg) })
        function pushResult (data) {
          if (jsparse) { data = JSON.parse(data.toString()) }
          result.push(data)
        }
      }
    })

    test('Use parser to read file by passing filename and get results with callback' + extramsg, function (t) {
      t.plan(6)

      if (includePath) {
        fasta({ includePath: true }, file, callback1)
      } else {
        fasta(file, callback1)
      }
      function callback1 (err, result) {
        t.error(err, 'callback error should be null')
        var objects = []
        result.toString().split('\n').forEach(pushObject)
        function pushObject (obj) {
          if (obj !== '') {
            objects.push(JSON.parse(obj))
          }
        }
        var msg = 'should return a Buffer with all sequences objects separated by newline'
        t.deepEqual(objects, solution, msg)
      }

      var options = { objectMode: true }
      if (includePath) { options.includePath = true }
      fasta(options, file, function (err, result) {
        t.error(err, 'callback error should be null')
        var msg = 'should return an array of Objects'
        t.deepEqual(result, solution, msg)
      })

      if (includePath) {
        fasta.obj({ includePath: true }, file, callback2)
      } else {
        fasta.obj(file, callback2)
      }
      function callback2 (err, result) {
        t.error(err, 'callback error should be null')
        var msg = 'should return an array of Objects'
        t.deepEqual(result, solution, msg)
      }
    })
  }

  test('Errors should be caught', function (t) {
    t.plan(1)
    var msg = 'should return a ENOENT error for non-existing path'
    fasta('./nosuchfile.fasta')
    .on('error', function (error) { t.equal(error.code, 'ENOENT', msg) })
  })
}
