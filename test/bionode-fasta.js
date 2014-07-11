var bionodeFasta = require('../')
var should = require('should')
var data = require('./data')

require('mocha')

describe("read FASTA format", function() {
  it("should return an array of sequence objects", function(done) {
    bionodeFasta.readFasta(data.fastaFormat).should.eql(data.fastaArray)
    done()
  })
})

describe("read aligned FASTA format", function() {
  it("should return an array of sequence objects for alignment", function(done) {
    bionodeFasta.readFasta(data.fastaFormat).should.eql(data.fastaArray)
    done()
  })
})

 describe("create FASTA format", function() {
   it("should return a string in FASTA format", function(done) {
     bionodeFasta.createFasta(data.fastaArray).should.eql(data.fastaFormat)
     done()
   })
 })