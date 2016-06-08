'use strict';

var getGlobbedFiles = require('../utils/getGlobbedFiles');
var path = require('path');

var configObject = {};

getGlobbedFiles(path.join(__dirname, './configs/*.js'))
	.forEach(function (path) {
		configObject[path.basename(path, '.js')] = require(path);
	});

module.exports = configObject;