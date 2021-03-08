const compiler = require('../src/index.js');
const path = require('path');
console.log('running');
compiler({
    input:path.resolve(__dirname,'Hello.vue'),
    output:path.resolve(__dirname,'../examples/hello.vue.js'),
})