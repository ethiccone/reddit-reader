'use strict';

var format = require('../../../../../services/format');
var config = require('../../../../../config');

var csvFileFields = [
	{ label: 'domain', value: 'domain' },
	{ label: 'articles count', value: 'articlesCount' },
	{ label: 'score summ', value: 'scoreSum' }
];

module.exports = {
	sorting: {
		csv: function (data, parameters, callback) {
			format.jsonToCsv(data, [{
				label: 'id',
				value: 'data.id'
			}, {
				label: 'title',
				value: 'data.title'
			}, {
				label: 'utc creation date',
				value: 'data.created'
			}, {
				label: 'score',
				value: 'data.score'
			}], config.delimiters[parameters.delimiter], callback);
		},
		sql: function (data, parameters, callback) {
			var columns = {};
			['id', 'title', 'created', 'score'].forEach(function (col) {
				columns[parameters[col] || col] = col;
			});

			return format.jsonToSqlInsertScrypt(
				data, parameters.tableName, columns, callback
			);
		}
	},
	aggregation: {
		csv: function (data, parameters, callback) {
			format.jsonToCsv(
				data, csvFileFields, config.delimiters[parameters.delimiter], callback
			);
		}
	}
};