const fs = require('fs');
const buf = fs.readFileSync('assets/icon.png');
console.log('Icon header bytes:', buf.subarray(0, 16));
console.log('PNG Magic:', buf.subarray(0, 8).toString('hex'));
