'use strict';

var MongoClient = require('mongodb').MongoClient;
var config = require('../config').db.mongo;

module.exports = {
	db: null,
	connect: function (callback) {
		var self = this;

		if (self.db) {
			console.log('Database is already connected');
			return callback();
		}

		MongoClient.connect(config.connectionString, function(err, db) {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			self.db = db;
			callback();
		});
	}
};