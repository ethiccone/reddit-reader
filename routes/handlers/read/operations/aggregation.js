'use strict';

var Steppy = require('twostep').Steppy;
var HTTPError = require('http-errors');

var Articles = require('../../../../db/mongo').collections.articles;
var reddit = require('../../../../services/http/reddit');
var validator = require('../../../../services/validator');
var format = require('./lib/format');
var config = require('../../../../config');
var utils = require('./lib/utils');

var outputFormatsInfo = config.outputFormatsInfo;

var aggGroup = {
	$group: {
		_id: "$data.domain",
		scoreSum: { $sum: "$data.score" },
		articlesCount: { $sum: 1 }
	}
};
var aggProject = {
	$project: {
		domain: "$_id",
		_id: 0,
		scoreSum: 1,
		articlesCount: 1
	}
};

module.exports = function (req, res, next) {
	var params = req.body;
	var url = params.url;

	// TODO: remove it if format would be implemented for aggregation
	params.format = 'csv';

	Steppy(
		// check parameters
		function () {
			var validationResult = validator.aggregationParameters.validate(params);
			if (!validationResult.valid) {
				throw HTTPError.BadRequest(
					utils.formatValidationErrorMessage(validationResult.errors)
				);
			}
			this.pass(true);
		},
		// get cached articles
		function (err, isValid) {
			Articles.find({ query: url }, {}).toArray(this.slot());
		},
		// get data from reddit
		function (err, articles) {
			if (articles && !articles.length) {
				reddit(url, this.slot());
				this.pass(true);
			} else {
				this.pass(articles);
				this.pass(false);
			}
		},
		// map and insert requested data to db
		function (err, articles, isNew) {
			isNew &&
			Articles.insertMany(utils.mapRedditData(articles, url), this.slot()) ||
			this.pass(articles);
		},
		// aggregate
		function (err, articles) {
			if (err) {
				console.log(err);
				throw HTTPError.InternalServerError();
			}

			Articles.aggregate([{ $match: { query: url } }, aggGroup, aggProject], {}, this.slot());
		},
		// format aggregatedData
		function (err, aggregatedData) {
			format[params.operation][params.format](
				aggregatedData, params, this.slot()
			);
		},
		// send csv to client
		function (err, csv) {
			var fInfo = outputFormatsInfo[params.format];

			res.writeHead(200, {
				'Content-disposition': 'attachment; filename=aggregation.' + fInfo.ext
			});
			res.end(new Buffer(csv));
		},
		// handle errors
		function (err) {
			console.log('Error: ', err);
			next(err);
		}
	);
};