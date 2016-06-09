'use strict';

var getGlobbedFiles = require('../utils/getGlobbedFiles');
var path = require('path');

var configObject = {};

getGlobbedFiles(path.join(__dirname, './configs/*.js'))
	.forEach(function (pathName) {
		configObject[path.basename(pathName, '.js')] = require(pathName);
	});

module.exports = configObject;