const fs = require('fs');
const Jimp = require('jimp-compact');

async function fixImage(filePath) {
  try {
    console.log('Converting', filePath, 'with Jimp...');
    const img = await Jimp.read(filePath);
    const pngBuffer = await img.getBufferAsync(Jimp.MIME_PNG);
    fs.writeFileSync(filePath, pngBuffer);
    console.log('Successfully fixed', filePath, 'Magic:', pngBuffer.subarray(0, 8).toString('hex'));
  } catch (err) {
    console.error('Error fixing', filePath, err);
  }
}

async function run() {
  await fixImage('assets/icon.png');
  await fixImage('assets/adaptive-icon.png');
  await fixImage('assets/splash.png');
  await fixImage('assets/favicon.png');
}

run();
