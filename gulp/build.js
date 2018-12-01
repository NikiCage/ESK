'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
const filter = require('gulp-filter');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
    return gulp.src([
        path.join(conf.paths.src, '/app/**/*.html'),
        path.join(conf.paths.tmp, '/serve/app/**/*.html')
    ])
        .pipe($.htmlmin({
            collapseWhitespace: true,
            maxLineLength: 120,
            removeComments: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'chatapi',
            root: 'app'
        }))
        .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };

    var cssFilter = filter(file => /\.css/.test(file.path), { restore: true });
    var jsFilter = filter(file => /\.js$/.test(file.path), { restore: true });
    var appFilter = filter(file => /app\.js$/.test(file.path), { restore: true });
    var htmlFilter = filter(file => /\.html/.test(file.path), { restore: true });

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe($.useref())
        .pipe($.size({
            title: 'useref',
            showFiles: true
        }))
        .pipe(appFilter)
        .pipe($.babel({
            presets: ['env']
        }))
        .pipe(appFilter.restore)
        .pipe(jsFilter)
        .pipe($.size({
            title: 'jsFilter',
            showFiles: true
        }))
        //.pipe($.sourcemaps.init())
        .pipe($.ngAnnotate())
        .pipe($.uglifyEs.default())
        .on('error', conf.errorHandler('Uglify'))
        .pipe($.rev())
        //.pipe($.sourcemaps.write('maps'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        //.pipe($.sourcemaps.init())
        .pipe($.cleanCss())
        .pipe($.rev())
        //.pipe($.sourcemaps.write('maps'))
        .pipe(cssFilter.restore)
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.htmlmin({
            collapseWhitespace: true,
            maxLineLength: 120,
            removeComments: true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({
            title: path.join(conf.paths.dist, '/'),
            showFiles: true
        }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', function () {
    var fileFilter = $.filter(function (file) {
        return file.stat.isFile();
    });

    return gulp.src([
        path.join(conf.paths.src, '/.htaccess'),
        path.join(conf.paths.src, '/**/*'),
        path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
    ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function () {
    return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('build', ['html', 'fonts', 'other']);