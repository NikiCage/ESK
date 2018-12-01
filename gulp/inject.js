'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
const argv = require('yargs').argv;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function ()
{
    browserSync.reload();
});

gulp.task('inject', ['scripts', 'styles'], function ()
{
    var injectStylesPaths = [
        path.join(conf.paths.tmp, '/serve/app/**/*.css'),
        path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
    ];

    var injectScriptsPaths = [
        path.join(conf.paths.src, '/app/**/*.module.js'),
        path.join(conf.paths.src, '/app/**/*.js'),
        path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
        path.join('!' + conf.paths.src, '/app/**/*.mock.js')
    ];

    var injectStyles = gulp.src(injectStylesPaths, {read: false});
    var injectScripts = gulp.src(injectScriptsPaths)
        .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));


    var injectOptions = {
        ignorePath  : [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
        addRootSlash: false
    };

    return gulp.src(path.join(conf.paths.src, '/*.html'))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});