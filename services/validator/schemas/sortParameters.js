'use strict';

var _ = require('underscore');
var config = require('../../../config');
var operations = config.operations;
var outputFormats = config.outputFormats;
var delimiters = config.delimiters;
var fields = config.fields;
var directions = config.directions;

var delimitersKeys = _.keys(delimiters);
var outputFormatsValues = _.values(outputFormats);

module.exports = {
	properties: {
		operation: {
			enum: [operations.SORTING],
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
		field: {
			enum: fields,
			messages: {
				enum: 'Unsupported field for sorting'
			}
		},
		direction: {
			enum: directions,
			messages: {
				enum: 'Unsupported direction for sorting'
			}
		},
		format: {
			enum: outputFormatsValues,
			messages: {
				enum: 'Unsupported output format'
			}
		},
		delimiter: {
			conform: function (val, obj, prop) {
				return obj.format !== 'CSV' ||
					obj.format === 'CSV' && delimitersKeys.indexOf(val) != -1;
			},
			messages: {
				conform: 'Unsupported delimiter'
			}
		},
		tableName: {
			conform: function (val, obj, prop) {
				return obj.format !== 'SQL' ||
					obj.format === 'SQL' && typeof val === 'string' && val.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/);
			}
		},
		id: {
			type: 'string',
			conform: function (val, obj, prop) {
				return !val.length || isColumnName(val);
			},
			messages: {
				type: 'Invalid name for the column "id"',
				conform: 'Invalid name for the column "id"'
			}
		},
		title: {
			type: 'string',
			conform: function (val, obj, prop) {
				return !val.length || isColumnName(val);
			},
			messages: {
				type: 'Invalid name for the column "title"',
				conform: 'Invalid name for the column "title"'
			}
		},
		created: {
			type: 'string',
			conform: function (val, obj, prop) {
				return !val.length || isColumnName(val);
			},
			messages: {
				type: 'Invalid name for the column "created"',
				conform: 'Invalid name for the column "created"'
			}
		},
		score: {
			type: 'string',
			conform: function (val, obj, prop) {
				return !val.length || isColumnName(val);
			},
			messages: {
				type: 'Invalid name for the column "score"',
				conform: 'Invalid name for the column "score"'
			}
		}
	}
};

function isColumnName (name) {
	var columnNameRE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
	// for PostgreSQL
	var quotedColumnNameRE = /^"[a-zA-Z_][a-zA-Z0-9_]*"$/;

	return columnNameRE.test(name) || quotedColumnNameRE.test(name);
}