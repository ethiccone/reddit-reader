'use strict';

var MongoClient = require('mongodb').MongoClient;
var config = require('../config').db.mongo;

var Steppy = require('twostep').Steppy;
var getGlobbedFiles = require('../utils/getGlobbedFiles');
var path = require('path');

module.exports = {
	db: null,
	connect: function (callback) {
		var self = this;

		if (self.db) {
			console.log('Database is already connected');
			return callback();
		}

		Steppy(
			function () {
				MongoClient.connect(config.connectionString, this.slot());
			},
			function (err, db) {
				self.db = db;

				getGlobbedFiles(path.join(__dirname, './collections/*.js'))
					.forEach(function (pathName) {
						require(pathName)(self);
					});

				if (typeof callback === 'function') {
					callback();
				}
			},
			function (err) {
				console.log(err);
				process.exit(1);
			}
		);
	},
	collections: {}
};