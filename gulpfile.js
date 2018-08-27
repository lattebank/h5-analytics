var gulp = require('gulp');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var rename = require('gulp-rename');
var concat = require('gulp-concat');


gulp.task('tracking', function () {
  var opts = {
    compress: {
      drop_console: true,
    },
    output: {
      max_line_len: 64,
    },
  };

  return gulp
    .src('./tracking/index.js')
    .pipe(uglify(opts))
    .pipe(header('/* h5a-tracking ' + require('./tracking/package.json').version + '  */\n'))
    .pipe(rename('tracking.min.js'))
    .pipe(gulp.dest('./tracking'));
});


gulp.task('adapter', function () {
  var opts = {
    compress: {
      drop_console: true,
    },
  };

  return gulp
    .src('./adapter/index.js')
    .pipe(uglify(opts))
    .pipe(header('/* h5a-adapter ' + require('./package.json').version + '  */\n')) // 实际上这个项目的核心是 adapter
    .pipe(rename('adapter.min.js'))
    .pipe(gulp.dest('./adapter'));
});


gulp.task('build', function () {
  return gulp
    .src([
      './node_modules/@lattebank/analytics.js-core/dist/analytics.core.min.js',
      './adapter/adapter.min.js',
    ])
    .pipe(concat('analytics.js'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('build-debug', function () {
  return gulp
    .src([
      './node_modules/@lattebank/analytics.js-core/dist/analytics.core.js',
      './adapter/index.js',
    ])
    .pipe(concat('analytics-debug.js'))
    .pipe(gulp.dest('./dist'));
});
