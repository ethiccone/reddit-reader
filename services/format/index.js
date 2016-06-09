'use strict';

var getGlobbedFiles = require('../../utils/getGlobbedFiles');
var path = require('path');

var format = {};

getGlobbedFiles(path.join(__dirname, './strategies/*.js'))
	.forEach(function (pathName) {
		format[path.basename(pathName, '.js')] = require(pathName);
	});

module.exports = format;