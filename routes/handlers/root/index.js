'use strict';

var _ = require('underscore');
var config = require('../../../config');

var delimiters = config.delimiters;
var fields = config.fields;
var directions = config.directions;
var outputFormats = config.outputFormats;

var delimitersArray = _.map(_.keys(delimiters), function (key) {
	return {
		key: key,
		text: key.toLowerCase(key)
	};
});

module.exports = function (req, res, next) {
	res.render('index', {
		title: 'Reddit reader',
		params: {
			delimiters: delimitersArray,
			fields: fields,
			directions: directions,
			outputFormats: outputFormats,
			operations: config.operations,
			activeOperation: config.operations.AGGREGATION
		}
	});
};