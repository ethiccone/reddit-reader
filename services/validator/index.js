'use strict';

var getGlobbedFiles = require('../../utils/getGlobbedFiles');
var path = require('path');
var conform = require('conform');

var validator = {};

getGlobbedFiles(path.join(__dirname, './schemas/*.js'))
	.forEach(function (pathName) {
		var schema = require(pathName);
		validator[path.basename(pathName, '.js')] = {
			validate: function (objToValidate) {
				return conform.validate(objToValidate, schema);
			}
		};
	});

module.exports = validator;