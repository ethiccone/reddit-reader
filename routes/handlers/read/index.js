'use strict';

var _ = require('underscore');
var HTTPError = require('http-errors');

var config = require('../../../config');
var operationsValues = _.values(config.operations);

module.exports = function (req, res, next) {
	var operation = req.body.operation;

	if (operationsValues.indexOf(operation) === -1) {
		return next(HTTPError.BadRequest('Unsupported operation'));
	}

	require('./operations/' + operation)(req, res, next);
};