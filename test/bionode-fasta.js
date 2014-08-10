var fs = require('fs')
var should = require('should')
var fasta = require('../')
var data = require('./data')

require('mocha')

describe("Read a fasta file and pipe content to parser.", function() {
  it("should return a Buffer for each sequence", function(done) {
    var result = []
    fs.createReadStream('./test/test.fasta')
    .pipe(fasta())
    .on('data', pushResult)
    .on('end', testResult)
    function pushResult(data) { result.push(JSON.parse(data.toString())) }
    function testResult() {
      result.should.eql(data.fasta)
      done()
    }
  })
  it("should return an Object for each sequence", function(done) {
    var result = []
    fs.createReadStream('./test/test.fasta')
    .pipe(fasta({ objectMode: true }))
    .on('data', pushResult)
    .on('end', testResult)
    function pushResult(data) { result.push(data) }
    function testResult() {
      result.should.eql(data.fasta)
      done()
    }
  })
  it("should return an Object for each sequence (shortcut version)", function(done) {
    var result = []
    fs.createReadStream('./test/test.fasta')
    .pipe(fasta.obj())
    .on('data', pushResult)
    .on('end', testResult)
    function pushResult(data) { result.push(data) }
    function testResult() {
      result.should.eql(data.fasta)
      done()
    }
  })
})

testFilename('./test/test.fasta')
testFilename('./test/test.fasta.gz')
testFilename('./test/test.fasta', true)
testFilename('./test/test.fasta.gz', true)

function testFilename(file, includePath) {
  var solution = JSON.parse(JSON.stringify(data.fasta))
  var extra = ''
  if (includePath) {
    extra = ' (add path to results)'
    solution.forEach(addPath)
    function addPath(obj, i) {
      obj.path = file
      solution[i] = obj
    }
  }

  if ('gz' === file.split('.').pop()) {
    extra += ' (read gzipped file)'
  }

  describe("Use parser to read file by passing filename" + extra, function() {
    it("should return a Buffer for each sequence", function(done) {
      var result = []
      var parser = includePath ? fasta({ includePath: true }, file) : fasta(file)
      parser
      .on('data', pushResult)
      .on('end', testResult)
      function pushResult(data) { result.push(JSON.parse(data.toString())) }
      function testResult() {
        result.should.eql(solution)
        done()
      }
    })
    it("should return an Object for each sequence", function(done) {
      var result = []
      var options = { objectMode: true }
      if (includePath) { options.includePath = true }
      fasta(options, file)
      .on('data', pushResult)
      .on('end', testResult)
      function pushResult(data) { result.push(data) }
      function testResult() {
        result.should.eql(solution)
        done()
      }
    })
    it("should return an Object for each sequence (shortcut version)", function(done) {
      var result = []
      var parser = includePath ? fasta.obj({ includePath: true }, file) : fasta.obj(file)
      parser
      .on('data', pushResult)
      .on('end', testResult)
      function pushResult(data) { result.push(data) }
      function testResult() {
        result.should.eql(solution)
        done()
      }
    })
  })


  describe("Use parser to read file by passing filename and get results with callback" + extra, function() {
    it("should return a Buffer with all sequences objects separated by newline" + extra, function(done) {
      if (includePath) {
        fasta({ includePath: true }, file, callback)
      }
      else {
        fasta(file, callback)
      }
      function callback(err, result) {
        (err === null).should.be.true
        var objects = []
        result.toString().split('\n').forEach(pushObject)
        function pushObject(obj) {
          if (obj !== '') {
            objects.push(JSON.parse(obj))
          }
        }
        objects.should.eql(solution)
        done()
      }
    })
    it("should return an array of Objects", function(done) {
      var options = { objectMode: true }
      if (includePath) { options.includePath = true }
      fasta(options, file, function(err, result) {
        result.should.eql(solution)
        done()
      })
    })
    it("should return an array of Objects", function(done) {
      if (includePath) {
        fasta.obj({ includePath: true }, file, callback)
      }
      else {
        fasta.obj(file, callback)
      }
      function callback(err, result) {
        result.should.eql(solution)
        done()
      }
    })
  })
}


describe("Errors should be caught", function() {
  it("should return a ENOENT error for non-existing path", function(done) {
    fasta('./nosuchfile.fasta')
    .on('error', function(error) {
      error.code.should.eql('ENOENT')
      done()
    })
  })
})
