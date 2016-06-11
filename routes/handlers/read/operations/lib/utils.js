'use strict';

var _ = require('underscore');

module.exports = {
	formatValidationErrorMessage: function (errors) {
		return 'Wrong parameters: ' +
			_.map(errors, function (error) {
				return '"' + error.message + '"';
			})
			.join(', ');
	},
	mapRedditData: function (articles, url) {
		var createdAt = new Date();

		return _.map(articles.data.children, function (item) {
			return {
				query: url,
				createAt: createdAt,
				data: {
					id: item.data.id,
					domain: item.data.domain,
					title: item.data.title,
					created: item.data.created,
					score: item.data.score
				}
			};
		});
	}
};