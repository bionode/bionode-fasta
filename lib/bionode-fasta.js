
// ## Fasta format functions
// ---

// ### Read sequence/alignment format

// Read sequence/alignment format and create array of sequence objects. If `aligned` is true or `-` characters present in sequences, an unaligned `seq` key is created as well as preserving the aligned sequence in `aligned`.
//
//     //Sample FASTA file
//     console.log(sampleFASTA);
//     => >SEQUENCE_1
//        MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEG
//        LVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHK
//        IPQFASRKQLSDAILKEAEEKIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTL
//        MGQFYVMDDKKTVEQVIAEKEKEFGGKIKIVEFICFEVGEGLEKKTEDFAAEVAAQL
//        >SEQUENCE_2
//        SATVSEINSETDFVAKNDQFIALTKDTTAHIQSNSLQSVEELHSSTINGVKFEEYLKSQI
//        ATIGENLVVRRFATLKAGANGVVNGYIHTNGRVGVVIAAACDSAEVASKSRDLLRQICMH
//
//     bionode.readFasta(sampleFASTA);
//     => [ { name: 'SEQUENCE_1',
//            seq: 'MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEGLVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHKIPQFASRKQLSDAILKEAEEKIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTLMGQFYVMDDKKTVEQVIAEKEKEFGGKIKIVEFICFEVGEGLEKKTEDFAAEVAAQL' },
//          { name: 'SEQUENCE_2',
//            seq: 'SATVSEINSETDFVAKNDQFIALTKDTTAHIQSNSLQSVEELHSSTINGVKFEEYLKSQIATIGENLVVRRFATLKAGANGVVNGYIHTNGRVGVVIAAACDSAEVASKSRDLLRQICMH' } ]
Bionode.prototype.readFasta = function(input, sequenceType, aligned) {
  var lines = input.toString().split("\n")
  var object = {}
  var array = []
  var containsGap = false

  var current = ""
  lines.forEach(function(line){
    if (line.match(/(^>)/)){
      current = line.substring(1)
      object[current] = ""
    }
    else if(line.match(/(-)/)){
      containsGap = true
      object[current] = object[current].concat(line)
    }
    else{
      object[current] = object[current].concat(line)
    }
  })
  for (var key in object) {
    if (!sequenceType){
      sequenceType = bionode.checkSequenceType(object[key].replace(/-/g,""))
    }
    if(aligned || containsGap){
      array.push({name: key, seqType: sequenceType, seq: object[key].replace(/-/g,""), aligned: object[key]})
    }
    else{
      array.push({name: key, seq: object[key], seqType: sequenceType})
    }
  }
  return array
}

// ### Create sequence/alignment format

// Create sequence/alignment format from an array of sequence objects
//
//     //Sample sequence array
//     console.log(sequences);
//     => [ { name: 'SEQUENCE_1',
//            seq: 'MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEGLVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHKIPQFASRKQLSDAILKEAEEKIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTLMGQFYVMDDKKTVEQVIAEKEKEFGGKIKIVEFICFEVGEGLEKKTEDFAAEVAAQL' },
//          { name: 'SEQUENCE_2',
//            seq: 'SATVSEINSETDFVAKNDQFIALTKDTTAHIQSNSLQSVEELHSSTINGVKFEEYLKSQIATIGENLVVRRFATLKAGANGVVNGYIHTNGRVGVVIAAACDSAEVASKSRDLLRQICMH' } ]
//
//     bionode.createFormat(sequences);
//     => >SEQUENCE_1
//        MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEG
//        LVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHK
//        IPQFASRKQLSDAILKEAEEKIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTL
//        MGQFYVMDDKKTVEQVIAEKEKEFGGKIKIVEFICFEVGEGLEKKTEDFAAEVAAQL
//        >SEQUENCE_2
//        SATVSEINSETDFVAKNDQFIALTKDTTAHIQSNSLQSVEELHSSTINGVKFEEYLKSQI
//        ATIGENLVVRRFATLKAGANGVVNGYIHTNGRVGVVIAAACDSAEVASKSRDLLRQICMH
Bionode.prototype.createFasta = function(sequenceArray, aligned) {
  var string = ""
  sequenceArray.forEach(function(sequence){
    string += ">"+sequence.name+"\n"
    var lines = [];
    if (aligned && sequence.aligned){
      lines = sequence.aligned.match(/.{1,60}/g)
    }
    else{
      lines = sequence.seq.match(/.{1,60}/g)
    }
    lines.forEach(function(line){
      string += line+"\n"
    })
  })
  return string.slice(0, -1)
}
