'use strict';

var express = require('express');
var router = express.Router();

var root = require('./handlers/root');

router.get('/', root);

module.exports = router;
