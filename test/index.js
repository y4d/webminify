const webminify = require('../lib');


webminify()
    .load('test/samples/(a|b).js')
    .compressjs()
    .output('test/samples/output.js');
