###
# Credit: @steambap
# https://github.com/steambap
# https://github.com/steambap/png-to-ico/blob/master/index.js
# Adapted to not include 256x256 .ico file
###

jimp = require('jimp')

#: Errors

err = new Error('Incorrect image size.')
err.code = 'ESIZE'

#: Allowed image sizes

sizeList = [48, 32, 16]

#: Converts images to .ICO

imagesToIco = (images) ->
	imageDataArr = []
	header = getHeader(images.length)
	headerAndIconDir = [header]
	len = header.length
	offset = len + 16 * images.length

	images.forEach((img) ->
		dir = getDir(img, offset)
		bmpInfoHeader = getBmpInfoHeader(img)
		dib = getDib(img)
		headerAndIconDir.push(dir)
		imageDataArr.push(bmpInfoHeader, dib)
		len += dir.length + bmpInfoHeader.length + dib.length
		offset += bmpInfoHeader.length + dib.length
	)
	return Buffer.concat(
		headerAndIconDir.concat(imageDataArr),
		len
	)

#: Gets .ICO header

getHeader = (numOfImages) ->
	buf = Buffer.alloc(6)
	buf.writeUInt16LE(0, 0)													# Reserved, 0
	buf.writeUInt16LE(1, 2)													# Image type: 1 (.ICO)
	buf.writeUInt16LE(numOfImages, 4)								# Number of images in file
	return buf

#: Image characteristics

getDir = (img, offset) ->
	bpp = 32
	buf = Buffer.alloc(16)
	bitmap = img.bitmap
	size = bitmap.data.length + 40
	width = if bitmap.width >= 256 then 0 else bitmap.width
	height = width

	buf.writeUInt8(width, 0)												# Width in pixels
	buf.writeUInt8(height, 1)												# Height in pixels
	buf.writeUInt8(0, 2)														# 0 if no color palette used
	buf.writeUInt8(0, 3)														# Reserved, 0
	buf.writeUInt16LE(0, 4)													# Color planes, 0 || 1
	buf.writeUInt16LE(bpp, 6)												# Bits per pixel
	buf.writeUInt32LE(size, 8)											# Image size in bytes
	buf.writeUInt32LE(offset, 12)										# Image data offset from file start
	return buf

#: Bitmap formatting

getBmpInfoHeader = (img) ->
	bpp = 32
	buf = Buffer.alloc(40)
	bitmap = img.bitmap
	size = bitmap.data.length
	width = bitmap.width
	height = width * 2															# BPM: doubled height
	buf.writeUInt32LE(40, 0)												# Header size in bytes
	buf.writeInt32LE(width, 4)											# Bitmap width in pixels
	buf.writeInt32LE(height, 8)											# Bitmap height in pixels
	buf.writeUInt16LE(1, 12)												# Number of color planes, 1
	buf.writeUInt16LE(bpp, 14)											# Number of bits per pixel
	buf.writeUInt32LE(0, 16)												# Compression method
	buf.writeUInt32LE(size, 20)											# Image size
	buf.writeInt32LE(0, 24)													# Horizontal resolution of image
	buf.writeInt32LE(0, 28)													# Vertical resolution of image (!!!)
	buf.writeUInt32LE(0, 32)												# Number of colors || 0
	buf.writeUInt32LE(0, 36)												# Number of important colors || 0
	return buf

#: Bitmap creation

getDib = (img) ->
	bitmap = img.bitmap
	size = bitmap.data.length
	buf = Buffer.alloc(size)
	width = bitmap.width
	height = width
	lowerLeftPos = (height - 1) * width * 4
	for x in [0...width]
		for y in [0...height]
			pxColor = img.getPixelColor(x, y)
			r = pxColor >> 24 & 255
			g = pxColor >> 16 & 255
			b = pxColor >> 8 & 255
			a = pxColor & 255
			bmpPos = lowerLeftPos - (y * width * 4) + x * 4
			buf.writeUInt8(b, bmpPos)
			buf.writeUInt8(g, bmpPos + 1)
			buf.writeUInt8(r, bmpPos + 2)
			buf.writeUInt8(a, bmpPos + 3)
	return buf

#: Exports

module.exports = (filepath) ->
	jimp.read(filepath).then((image) ->
		bitmap = image.bitmap
		size = bitmap.width
		if image._originalMime != jimp.MIME_PNG or size != bitmap.height
			throw err
		if size != 48
			image.resize 48, 48, jimp.RESIZE_BICUBIC
		resizedImages = sizeList.map((targetSize) ->
			image.clone().resize(
				targetSize,
				targetSize,
				jimp.RESIZE_BICUBIC
			)
		)
		Promise.all(resizedImages.concat(image))
	).then(imagesToIco)

#::: End Program :::