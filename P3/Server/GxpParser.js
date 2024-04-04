const gpxParse = require('gpx-parse');

function parseGPX(filePath) {
  return new Promise((resolve, reject) => {
    gpxParse.parseGpxFromFile(filePath, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = { parseGPX };
