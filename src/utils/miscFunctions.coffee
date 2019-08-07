uuid = require 'uuid/v1'

#: Bullet Print

bullet = (text) ->
	console.log("• #{text}")

#: Check if string contains list of substrings

stringContains = (text, items) ->
	for i in [0...items.length]
		if items[i].includes('.')
			items[i] = "\\#{items[i]}"
	return new RegExp(items.join('|')).test(text)

#: Icon Name Generator

iconNameGen = () ->
	return "./icons/#{uuid()}.ico"

#: Exports

module.exports =
	bullet: bullet
	stringContains: stringContains
	iconNameGen: iconNameGen

#::: End Program :::