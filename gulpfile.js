'use strict';
var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = {
  dev: 'dev',
  build: 'build',
  cdn: 'cdn'
};

gulp.task('bower', function() {
  var bower = require('gulp-bower');
  bower();
});

gulp.task('less-dev', function() {
  // less, less, and autoprefixer under dev
  gulp.src([config.dev + '/less/*.less'])
    .pipe($.less({
      paths:[path.join(__dirname, 'dev/less/includes')] // Specify search paths for @import directives
      // compress: true
    }))
    .on('error', $.util.log)
    .pipe(gulp.dest(config.dev + '/styles/'));
});

gulp.task('autoprefixer', function() {
  gulp.src([config.dev + '/styles/*.css'])
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'IE 7', 'Firefox ESR'],
      cascade: true
    }))
    .pipe(gulp.dest(config.dev + '/styles/'));
});

gulp.task('jshint', function() {
  gulp.src([config.dev + '/scripts/**/*.js'])
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('csslint', function() {
  gulp.src([config.dev + '/styles/**/*.css'])
    .pipe($.csslint('.csslintrc'))
    .pipe($.csslint.reporter());
});

gulp.task('build-html', function() {
  // useref and css/js minify, then copy html into build folder
  var assets = $.useref.assets();
  gulp.src([
            config.dev + '/**/*.html',
            '!' + config.dev + '/bower_components/**'
          ])
    .pipe(
      $.inject(gulp.src([
        path.join(config.dev, 'scripts/**/*.js'),
        path.join(config.dev, 'styles/**/*.css')
      ], {
        read: false
    }), {
        relative: true
    }))
    .pipe(assets) // if the target file is js or css.
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest(config.build));
});

gulp.task('serve', function() {
  $.connect.server({
	  root: [config.dev],
	  livereload: true
  });
});

gulp.task('livereload', function() {
  $.watch([
            config.dev + '/*.html',
            config.dev + '/images/**/*',
            config.dev + '/styles/**/*.css',
            config.dev + '/scripts/**/*.js'
          ])
      .pipe($.connect.reload());
});

gulp.task('watch', function() {
  gulp.watch([
    config.dev + '/less/**/*.less'
  ], ['less-dev']);

  gulp.watch([
    config.dev + '/styles/**/*.css'
  ], ['csslint']);
  
  gulp.watch([
    config.dev + '/scripts/**/*.js'
  ], ['jshint']);
});

gulp.task('clean:build', function (cb) {
  require('rimraf')(config.build, cb);
});

gulp.task('clean:cdn', function (cb) {
  require('rimraf')(config.cdn, cb);
});

gulp.task('build', ['clean:build'], function () {
  gulp.start('_build');
});

gulp.task('_build', ['less-dev', 'csslint', 'jshint', 'build-html']);
gulp.task('default', ['less-dev', 'serve', 'watch', 'livereload']);

gulp.task('_cdn', ['build'], function() {
  var revAll = new $.revAll({ dontRenameFile: [/^\/favicon.ico$/g, '.html'] });
  return gulp.src(path.join(config.build, '**/*.*'))
    .pipe(revAll.revision())
    .pipe(gulp.dest(config.cdn));
});
gulp.task('cdn', ['clean:cdn'], function() {
    var revAll = new $.revAll({ dontRenameFile: [/^\/favicon.ico$/g, '.html'] });
      return gulp.src(path.join(config.build, '**/*.*'))
        .pipe(revAll.revision())
        .pipe(gulp.dest(config.cdn));
});