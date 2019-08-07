m = require('../utils/createIcon').main
assert = require('chai').assert
should = require('chai').should()

#: Test Constructor

describe 'main()', ->
	it 'Is function', ->
		m.should.be.a('function')

#::: End Program :::