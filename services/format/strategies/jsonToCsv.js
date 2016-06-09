'use strict';

var json2csv = require('json2csv');

module.exports = function (jsonData, fields, delimiter, callback) {
	json2csv({ data: jsonData, fields: fields, del: delimiter || ','}, callback);
};