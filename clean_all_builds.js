const fs = require('fs');
const path = require('path');

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
      console.log('Successfully removed:', dirPath);
    } catch (e) {
      console.error('Failed to remove:', dirPath, e.message);
    }
  }
}

removeDir(path.join(__dirname, 'android/app/build'));
removeDir(path.join(__dirname, 'android/build'));
removeDir(path.join(__dirname, 'node_modules/expo/android/build'));
removeDir(path.join(__dirname, 'node_modules/react-native-reanimated/android/build'));
