'use strict';

var _ = require('underscore');

module.exports = function (jsonData, tableName, columns, callback) {
	var columnsNamesArray = _.keys(columns);
	var rows = [];

	jsonData.forEach(function (dataObj) {
		var values = [];
		columnsNamesArray.forEach(function (name) {
			values.push(quote(dataObj.data[columns[name]]));
		});
		rows.push('(' + values.join(', ') + ')');
	});

	callback(null,
		'INSERT INTO ' + tableName +
		' (' + columnsNamesArray.join(', ') + ') VALUES' +
		rows.join(',') + ';'
	);
};

function quote(value) {
	return typeof value === 'string' ? '\'' + value.split('\'').join('\\\'') + '\'' : value;
}