const gpxParse = require('gpx-parse');
const filePath = 'P3/Data/Blacks-Mountain-Half-Marathon-2019.gpx'

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
