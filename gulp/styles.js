'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles-reload', ['styles'], function ()
{
    return buildStyles()
        .pipe(browserSync.stream());
});

gulp.task('styles', function ()
{
    return buildStyles();
});

var buildStyles = function ()
{
    var sassOptions = {
        style: 'expanded'
    };

    return gulp.src([
            path.join(conf.paths.src, '/ionic.app.scss')
        ])
        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));
};