'use strict';

var express = require('express');
var router = express.Router();

var read = require('./handlers/read');

router.post('/', read);

module.exports = router;
