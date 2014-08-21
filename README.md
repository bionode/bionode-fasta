<p align="center">
  <a href="http://bionode.io">
    <img height="200" width="200" title="bionode" alt="bionode logo" src="https://rawgithub.com/bionode/bionode/master/docs/bionode-logo.min.svg"/>
  </a>
  <br/>
  <a href="http://bionode.io/">bionode.io</a>
</p>
# bionode-fasta
> Streamable FASTA parser.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]
[![Gitter chat][gitter-image]][gitter-url]
[![DOI][doi-image]][doi-url]


Install
-------

Install ```bionode-fasta``` with [npm](//npmjs.org):

```sh
$ npm install bionode-fasta
```
To use it as a command line tool, you can install it globally by adding ```-g``` .

Alternatively, just include `bionode-fasta.min.js` via a `<script/>` in your page.

Usage
-----

If you are using ```bionode-fasta``` with Node.js, you can require the module:

```js
var fasta = require('bionode-fasta')

fasta('./input.fasta').pipe(process.stdout) // Returns Buffers
fasta.obj('./input.fasta').on('data', console.log) // Returns Objects
fs.createReadStream('./input.fasta').pipe(fasta()) // Parses streamed content
fs.createReadStream('./fasta-list.txt')
.pipe(split())
.pipe(fasta({filenameMode: true})) // Parses files from filename Strings

=>   { id: 'sequence1',
       seq: 'ATGCACGTCACGTCAGTACTCGTCAGTAC' }
     { id: 'sequence2',
       seq: 'CAGTCCTACTGCATGCATGCATGCATGCATCGATGCATGTCGACTGCATGCATGC' }

fasta.obj({includePath: true}, './input.fasta').on('data', console.log) // Returns Objects
=>   { id: 'sequence1',
       seq: 'ATGCACGTCACGTCAGTACTCGTCAGTAC'
       path: './input.fasta' }
```

Please read the [documentation](http://rawgit.com/bionode/bionode-fasta/master/docs/bionode-fasta.html) for the methods exposed by bionode-fasta.

### Command line example
```sh
$ bionode-fasta input.fasta output.json
```

Contributing
------------

To contribute, clone this repo locally and commit your code on a separate branch.

Please write unit tests for your code, and check that everything works by running the following before opening a pull-request:

```sh
$ npm test
```

Please also check for code coverage:

```sh
$ npm run coverage
```

To rebuild and minify the module for the browser:

```sh
$ npm run build-browser
```

To rebuild the documentation using the comments in the code:

```sh
$ npm run build-docs
```
Check the [issues](http://github.com/bionode/bionode-fasta/issues) for ways to contribute.

Contacts
--------
Bruno Vieira <[mail@bmpvieira.com](mailto:mail@bmpvieira.com)> [@bmpvieira](//twitter.com/bmpvieira)  

License
--------

bionode-fasta is licensed under the [MIT](https://raw.github.com/bionode/bionode-fasta/master/LICENSE) license.  
Check [ChooseALicense.com](http://choosealicense.com/licenses/mit) for details.

[npm-url]: http://npmjs.org/package/bionode-fasta
[npm-image]: http://img.shields.io/npm/v/bionode-fasta.svg?style=flat
[travis-url]: http:////travis-ci.org/bionode/bionode-fasta
[travis-image]: http://img.shields.io/travis/bionode/bionode-fasta.svg?style=flat
[coveralls-url]: http:////coveralls.io/r/bionode/bionode-fasta
[coveralls-image]: http://img.shields.io/coveralls/bionode/bionode-fasta.svg?style=flat
[depstat-url]: http://david-dm.org/bionode/bionode-fasta
[depstat-image]: http://img.shields.io/david/bionode/bionode-fasta.svg?style=flat
[gitter-image]: http://img.shields.io/badge/gitter-bionode/bionode--fasta-brightgreen.svg?style=flat
[gitter-url]: https://gitter.im/bionode/bionode-fasta
[doi-url]: http://dx.doi.org/10.5281/zenodo.11307
[doi-image]: http://img.shields.io/badge/doi-10.5281/zenodo.11307-blue.svg?style=flat

[![Bitdeli Badge](http://d2weczhvl823v0.cloudfront.net/bionode/bionode-fasta/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
