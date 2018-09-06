const webminify = require('../lib');


webminify()
    .load('test/samples/(a|b).js')
    .combine()
    .compressjs()
    .output('test/samples/output.js');
