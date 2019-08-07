/*
 * Credit: @steambap
 * https://github.com/steambap
 * https://github.com/steambap/png-to-ico/blob/master/index.js
 * Adapted to not include 256x256 .ico file
 */
var err, getBmpInfoHeader, getDib, getDir, getHeader, imagesToIco, jimp, sizeList;

jimp = require('jimp');

//: Errors
err = new Error('Incorrect image size.');

err.code = 'ESIZE';

//: Allowed image sizes
sizeList = [48, 32, 16];

//: Converts images to .ICO
imagesToIco = function(images) {
  var header, headerAndIconDir, imageDataArr, len, offset;
  imageDataArr = [];
  header = getHeader(images.length);
  headerAndIconDir = [header];
  len = header.length;
  offset = len + 16 * images.length;
  images.forEach(function(img) {
    var bmpInfoHeader, dib, dir;
    dir = getDir(img, offset);
    bmpInfoHeader = getBmpInfoHeader(img);
    dib = getDib(img);
    headerAndIconDir.push(dir);
    imageDataArr.push(bmpInfoHeader, dib);
    len += dir.length + bmpInfoHeader.length + dib.length;
    return offset += bmpInfoHeader.length + dib.length;
  });
  return Buffer.concat(headerAndIconDir.concat(imageDataArr), len);
};

//: Gets .ICO header
getHeader = function(numOfImages) {
  var buf;
  buf = Buffer.alloc(6);
  buf.writeUInt16LE(0, 0); // Reserved, 0
  buf.writeUInt16LE(1, 2); // Image type: 1 (.ICO)
  buf.writeUInt16LE(numOfImages, 4); // Number of images in file
  return buf;
};

//: Image characteristics
getDir = function(img, offset) {
  var bitmap, bpp, buf, height, size, width;
  bpp = 32;
  buf = Buffer.alloc(16);
  bitmap = img.bitmap;
  size = bitmap.data.length + 40;
  width = bitmap.width >= 256 ? 0 : bitmap.width;
  height = width;
  buf.writeUInt8(width, 0); // Width in pixels
  buf.writeUInt8(height, 1); // Height in pixels
  buf.writeUInt8(0, 2); // 0 if no color palette used
  buf.writeUInt8(0, 3); // Reserved, 0
  buf.writeUInt16LE(0, 4); // Color planes, 0 || 1
  buf.writeUInt16LE(bpp, 6); // Bits per pixel
  buf.writeUInt32LE(size, 8); // Image size in bytes
  buf.writeUInt32LE(offset, 12); // Image data offset from file start
  return buf;
};

//: Bitmap formatting
getBmpInfoHeader = function(img) {
  var bitmap, bpp, buf, height, size, width;
  bpp = 32;
  buf = Buffer.alloc(40);
  bitmap = img.bitmap;
  size = bitmap.data.length;
  width = bitmap.width;
  height = width * 2; // BPM: doubled height
  buf.writeUInt32LE(40, 0); // Header size in bytes
  buf.writeInt32LE(width, 4); // Bitmap width in pixels
  buf.writeInt32LE(height, 8); // Bitmap height in pixels
  buf.writeUInt16LE(1, 12); // Number of color planes, 1
  buf.writeUInt16LE(bpp, 14); // Number of bits per pixel
  buf.writeUInt32LE(0, 16); // Compression method
  buf.writeUInt32LE(size, 20); // Image size
  buf.writeInt32LE(0, 24); // Horizontal resolution of image
  buf.writeInt32LE(0, 28); // Vertical resolution of image (!!!)
  buf.writeUInt32LE(0, 32); // Number of colors || 0
  buf.writeUInt32LE(0, 36); // Number of important colors || 0
  return buf;
};

//: Bitmap creation
getDib = function(img) {
  var a, b, bitmap, bmpPos, buf, g, height, i, j, lowerLeftPos, pxColor, r, ref, ref1, size, width, x, y;
  bitmap = img.bitmap;
  size = bitmap.data.length;
  buf = Buffer.alloc(size);
  width = bitmap.width;
  height = width;
  lowerLeftPos = (height - 1) * width * 4;
  for (x = i = 0, ref = width; (0 <= ref ? i < ref : i > ref); x = 0 <= ref ? ++i : --i) {
    for (y = j = 0, ref1 = height; (0 <= ref1 ? j < ref1 : j > ref1); y = 0 <= ref1 ? ++j : --j) {
      pxColor = img.getPixelColor(x, y);
      r = pxColor >> 24 & 255;
      g = pxColor >> 16 & 255;
      b = pxColor >> 8 & 255;
      a = pxColor & 255;
      bmpPos = lowerLeftPos - (y * width * 4) + x * 4;
      buf.writeUInt8(b, bmpPos);
      buf.writeUInt8(g, bmpPos + 1);
      buf.writeUInt8(r, bmpPos + 2);
      buf.writeUInt8(a, bmpPos + 3);
    }
  }
  return buf;
};

//: Exports
module.exports = function(filepath) {
  return jimp.read(filepath).then(function(image) {
    var bitmap, resizedImages, size;
    bitmap = image.bitmap;
    size = bitmap.width;
    if (image._originalMime !== jimp.MIME_PNG || size !== bitmap.height) {
      throw err;
    }
    if (size !== 48) {
      image.resize(48, 48, jimp.RESIZE_BICUBIC);
    }
    resizedImages = sizeList.map(function(targetSize) {
      return image.clone().resize(targetSize, targetSize, jimp.RESIZE_BICUBIC);
    });
    return Promise.all(resizedImages.concat(image));
  }).then(imagesToIco);
};

//::: End Program :::
