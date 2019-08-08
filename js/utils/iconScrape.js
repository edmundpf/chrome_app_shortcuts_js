var bullet, fav, fs, getIcon, iconNameGen, img, path, pngToIco, stringContains, url;

fs = require('fs');

url = require('url');

path = require('path');

img = require('image-downloader');

fav = require('get-website-favicon');

pngToIco = require('./pngToIco');

bullet = require('./miscFunctions').bullet;

iconNameGen = require('./miscFunctions').iconNameGen;

stringContains = require('./miscFunctions').stringContains;

//: Try to get icon from page
getIcon = async function(uri) {
  var defIco, error, favicon, host, i, ico, icoSize, icoSrc, imgBuffer, imgDownload, imgOpts, len, newIco, ref, ref1, tempSize;
  try {
    icoSize = 0;
    icoSrc = null;
    defIco = path.resolve('./icons/default.ico');
    host = `http://${(url.parse(uri).hostname)}`;
    favicon = (await fav(host));
    ref = favicon.icons;
    for (i = 0, len = ref.length; i < len; i++) {
      ico = ref[i];
      if (ico.type === 'image/x-icon') {
        icoSrc = ico.src;
        break;
      }
      if ((ref1 = ico.type) === 'image/png' || ref1 === 'image/jpg') {
        if (ico.size !== '') {
          try {
            tempSize = Number(ico.sizes.match('.+?(?=x)')[0]);
          } catch (error1) {
            error = error1;
            tempSize = 0;
          }
          if (tempSize >= icoSize) {
            icoSrc = ico.src;
            icoSize = tempSize;
          }
        } else {
          tempSize = 0;
          if (tempSize >= icoSize) {
            icoSrc = ico.src;
            icoSize = tempSize;
          }
        }
      }
    }
    if (icoSrc != null) {
      if (stringContains(icoSrc, ['.ico', '.ICO'])) {
        imgOpts = {
          url: icoSrc,
          dest: iconNameGen()
        };
      } else if (stringContains(icoSrc, ['.jpg', '.JPG', '.png', '.PNG'])) {
        imgOpts = {
          url: icoSrc,
          dest: './icons/icon.png'
        };
      } else {
        bullet("No icon found, will use default");
        return defIco;
      }
      imgDownload = (await img.image(imgOpts));
      if (imgDownload.filename.includes('.png')) {
        bullet('Converting .png icon to .ico');
        imgBuffer = (await pngToIco(imgDownload.filename));
        newIco = path.resolve(iconNameGen());
        fs.writeFileSync(newIco, imgBuffer);
        fs.unlinkSync(imgDownload.filename);
      } else {
        newIco = path.resolve(imgDownload.filename);
      }
      bullet(`Saved icon to: '${newIco}'`);
      return newIco;
    } else {
      bullet("No icon found, will use default");
      return defIco;
    }
  } catch (error1) {
    error = error1;
    throw error;
  }
};

//: Exports
module.exports = {
  getIcon: getIcon
};
