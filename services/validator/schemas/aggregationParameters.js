'use strict';

var _ = require('underscore');
var config = require('../../../config');
var operations = config.operations;
var delimiters = config.delimiters;

module.exports = {
	properties: {
		operation: {
			enum: [operations.AGGREGATION],
			messages: {
				enum: 'Wrong action'
			}
		},
		url: {
			format: 'url',
			messages: {
				format: 'URL is not valid'
			}
		},
		delimiter: {
			enum: _.keys(delimiters),
			messages: {
				enum: 'Unsupported delimiter'
			}
		}
	}
};