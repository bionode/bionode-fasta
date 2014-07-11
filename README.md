<p align="center">
  <a href="http://bionode.io">
    <img height="200" width="200" title="bionode" alt="bionode logo" src="https://rawgithub.com/bionode/bionode/master/docs/bionode-logo.min.svg"/>
  </a>
  <br/>
  <a href="http://bionode.io/">bionode.io</a>
</p>
# bionode-fasta


> FASTA format parser for bionode


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
var bionode-fasta = require('bionode-fasta')
//Sample FASTA file
console.log(sampleFASTA);
=> >SEQUENCE_1
   MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEG
   LVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHK
   IPQFASRKQLSDAILKEAEEKIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTL
   MGQFYVMDDKKTVEQVIAEKEKEFGGKIKIVEFICFEVGEGLEKKTEDFAAEVAAQL
   >SEQUENCE_2
   SATVSEINSETDFVAKNDQFIALTKDTTAHIQSNSLQSVEELHSSTINGVKFEEYLKSQI
   ATIGENLVVRRFATLKAGANGVVNGYIHTNGRVGVVIAAACDSAEVASKSRDLLRQICMH

bionode.readFasta(sampleFASTA);
=> [ { name: 'SEQUENCE_1',
       seq: 'MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEGLVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHKIPQFASRKQLSDAILKEAEEKIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTLMGQFYVMDDKKTVEQVIAEKEKEFGGKIKIVEFICFEVGEGLEKKTEDFAAEVAAQL' },
     { name: 'SEQUENCE_2',
       seq: 'SATVSEINSETDFVAKNDQFIALTKDTTAHIQSNSLQSVEELHSSTINGVKFEEYLKSQIATIGENLVVRRFATLKAGANGVVNGYIHTNGRVGVVIAAACDSAEVASKSRDLLRQICMH' } ]
```

Please read the [documentation](http://rawgit.com/alanrice/bionode-fasta/master/docs/bionode-fasta.html) for the methods exposed by bionode-template.

### Command line examples
```sh
$ bionode-fasta ~/sequences.fa
```

### Usage with [Dat](http://dat-data.com)
```sh
echo World | bionode-template greet | dat import --json
```

License
--------

bionode-fasta is licensed under the [MIT](https://raw.github.com/bionode/bionode-template/master/LICENSE) license.  
Check [ChooseALicense.com](http://choosealicense.com/licenses/mit) for details.
