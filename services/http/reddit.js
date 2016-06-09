'use strict';

var request = require('request');
var HTTPError = require('http-errors');

module.exports = function (url, callback) {
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(null, JSON.parse(body));
		} else {
			throw HTTPError(response.statusCode || 400, 'Reddit responded with error')
		}
	});
};