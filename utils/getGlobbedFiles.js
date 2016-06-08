'use strict';

const _ = require('underscore');
const glob = require('glob');

module.exports = function(globPatterns, removeRoot) {
  // For context switching
  var _this = this;

  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function(globPattern) {
      output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {

      let files = glob(globPatterns, { sync: true });

      if (removeRoot) {
        files = files.map(function(file) {
          return file.replace(removeRoot, '');
        });
      }
      output = _.union(output, files);

      // and for `gen`
      var genPrefix = './gen/';
      let genFiles = glob(genPrefix + globPatterns, { sync: true }).map(function(file) {
        return file.replace(genPrefix + removeRoot, '');
      });
      output = _.union(output, genFiles);
    }
  }

  return output;
};