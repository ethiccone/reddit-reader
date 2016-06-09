'use strict';

var express = require('express');
var router = express.Router();

var _ = require('underscore');
var Steppy = require('twostep').Steppy;
var HTTPError = require('http-errors');

var Articles = require('../db/mongo').collections.articles;
var validator = require('../services/validator');
var reddit = require('../services/http/reddit');
var format = require('../services/format');
var config = require('../config');

var operations = config.operations;
var delimiters = config.delimiters;
var delimitersArray = _.map(_.keys(delimiters), function (key) {
	return {
		key: key,
		text: key.toLowerCase(key)
	};
});

router.get('/', function(req, res, next) {
  res.render('index', {
		title: 'Reddit reader',
		delimiters: delimitersArray
	});
});

router.post('/read', function (req, res, next) {
	var params = req.body;
	var url = params.url;
	var operation = params.operation;

	if (_.values(operations).indexOf(operation) === -1) {
		return next(HTTPError.BadRequest('Unsupported operation'));
	}

	if (operation === operations.AGGREGATION) {
		Steppy(
			// check parameters
			function () {
				var validation = validator.aggregationParameters.validate(params);

				if (!validation.valid) {
					var messageDetails = _.map(validation.errors, function (error) {
							return '"' + error.message + '"';
						})
						.join(', ');

					throw HTTPError.BadRequest('Wrong parameters: ' + messageDetails);
				}

				this.pass(url);
				this.pass(params.delimiter)
			},
			function (err, url, delimiter) {
				this.pass(url);
				this.pass(delimiter);
				Articles.find({ query: url }, {})
					.toArray(this.slot());
			},
			// get data from reddit
			function (err, url, delimiter, articles) {
				this.pass(url);
				this.pass(delimiter);

				if (articles && !articles.length) {
					reddit(url, this.slot());
					this.pass(true);
				} else {
					this.pass(articles);
					this.pass(false);
				}
			},
			// map and insert requested data to db
			function (err, url, delimiter, articles, isNew) {
				this.pass(url);
				this.pass(delimiter);

				if (isNew) {
					var createdAt = new Date();
					var docs = _.map(articles.data.children, function (item) {
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
					Articles.insertMany(docs, this.slot());
				} else {
					this.pass(articles);
				}
			},
			// aggregate
			function (err, url, delimiter, articles) {
				if (err) {
					console.log(err);
					throw HTTPError.InternalServerError();
				}

				this.pass(delimiter);

				Articles.aggregate([{
					$match: {
						query: url
					}
				}, {
					$group: {
						_id: "$data.domain",
						scoreSum: { $sum: "$data.score" },
						articlesCount: { $sum: 1 }
					}
				}, {
					$project: {
						domain: "$_id",
						_id: 0,
						scoreSum: 1,
						articlesCount: 1
					}
				}], {}, this.slot());
			},
			// format aggregatedData
			function (err, delimiter, aggregatedData) {
				format.jsonToCsv(aggregatedData, [{
					label: 'domain',
					value: 'domain'
				}, {
					label: 'articles count',
					value: 'articlesCount'
				}, {
					label: 'score summ',
					value: 'scoreSum'
				}], delimiters[delimiter], this.slot());
			},
			// send csv to client
			function (err, csv) {
				res.writeHead(200, {
						'Content-Type': 'text/csv; charset=UTF-8',
						'Content-disposition': 'attachment; filename=aggregation.csv',
						'Content-Length': csv.length
					});
				res.end(new Buffer(csv));
			},
			// handle errors
			function (err) {
				console.log('Error: ', err);
				throw err;
			}
		);
	}



	//TODO: check if data already exist in db (caching)
});

module.exports = router;
