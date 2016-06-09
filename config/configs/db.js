'use strict';

module.exports = {
	mongo: {
		connectionString: process.env.MONGO_CONN_STR || 'mongodb://localhost/redditReader',
		collectionsSettings: {
			articles: {
				createdAt: {
					expireAfterSeconds: 3600
				}
			}
		}
	}
};