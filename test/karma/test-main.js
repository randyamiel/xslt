/*jslint browser: true, nomen: true, vars:true */
(function (requirejs) {
  'use strict';

  var args = window.__karma__.config.args || [];
  var indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
  var debug = indexOf.call(args, '--testDebug') >= 0;
  var allTestFiles = [];
  var pathToModule = function (path) {
    var base = path.replace(/^\/base\//, '../');
    if (/\.coffee$/.test(base)) {
      return 'coffee!' + base.replace(/\.coffee$/, '');
    }
    return base.replace(/\.js$/, '');
  };

  Object.keys(window.__karma__.files).forEach(function (file) {
    if (/^\/base\/test\/karma\/.*(spec|test)\.(js|coffee)$/i.test(file) || /^\/base\/test\/karma\/helpers\/.*\.(js|coffee)$/i.test(file)) {
      // Normalize paths to RequireJS module names.
      allTestFiles.push(pathToModule(file));
    }
  });

  requirejs.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/src',
    waitSeconds: 0,

    paths: {
      // test only
      'cs-plugin': '../node_modules/cs/cs',
      'passthrough': '../test/karma/passthrough',
      'cs-pass': '../test/karma/cs-passthrough',
      'js-pass': '../test/karma/js-passthrough',
      text: '../node_modules/text/text',
      prettydiff: '../node_modules/prettydiff/prettydiff',
      jquery: '../node_modules/jquery/dist/jquery',
      'coffee-script': '../node_modules/coffee-script/docs/v1/browser-compiler/coffee-script'
    },

    map: {
      '*': {
        'coffee': 'cs-plugin',
        'cs': debug ? 'cs-plugin' : 'cs-pass',
      }
    },

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
  });
}(window.requirejs));
