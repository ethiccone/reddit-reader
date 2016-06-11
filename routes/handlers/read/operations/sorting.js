'use strict';

var Steppy = require('twostep').Steppy;
var HTTPError = require('http-errors');

var Articles = require('../../../../db/mongo').collections.articles;
var reddit = require('../../../../services/http/reddit');
var validator = require('../../../../services/validator');
var format = require('./lib/format');
var config = require('../../../../config');
var utils = require('./lib/utils');

var outputFormats = config.outputFormats;
var outputFormatsInfo = config.outputFormatsInfo;

module.exports = function (req, res, next) {
	var params = req.body;
	var url = params.url;

	Steppy(
		// check parameters
		function () {
			var validationResult = validator.sortParameters.validate(params);
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
		// sort
		function (err, articles) {
			if (err) {
				console.log(err);
				throw HTTPError.InternalServerError();
			}

			var sortObj = {};
			sortObj['data.' + params.field] = params.direction === 'asc' ? 1 : -1;

			Articles.find({ query: url })
				.sort(sortObj)
				.toArray(this.slot());
		},
		// format data
		function (err, sortedData) {
			format[params.operation][params.format](sortedData, params, this.slot());
		},
		// send file to client
		function (err, file) {
			var fInfo = outputFormatsInfo[params.format];
			res.writeHead(200, {
				'Content-disposition': 'attachment; filename=sorted.' + fInfo.ext
			});
			res.end(new Buffer(file));
		},
		// handle errors
		function (err) {
			console.log('Error: ', err);
			next(err);
		}
	);
};