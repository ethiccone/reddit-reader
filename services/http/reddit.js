'use strict';

var request = require('request');
var HTTPError = require('http-errors');

module.exports = function (url, callback) {
	request(url, function (err, response, body) {
		if (!err && response.statusCode == 200) {
			var json;
			try {
				json = JSON.parse(body);
			} catch (e) {
				return callback(HTTPError.BadRequest('Specified URL returns no json data'));
			}
			callback(null, json);
		} else {
			err && console.log(err);
			callback(HTTPError(
				response.statusCode || 400,
				'Reddit responded with error' + (err ? ': ' + err.message : '')
			));
		}
	});
};