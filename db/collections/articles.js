'use strict';

var Collection = require('mongodbext').Collection;
var config = require('../../config').db.mongo.collectionsSettings.articles

var collectionName = 'articles';

module.exports = function (mongo, callback) {
	mongo.collections[collectionName] = new Collection(mongo.db, collectionName);

	mongo.collections[collectionName].createIndex({
		createAt: 1
	}, {
		expireAfterSeconds: config.createdAt.expireAfterSeconds
	}, typeof callback === 'function' ? callback : function () {});
};