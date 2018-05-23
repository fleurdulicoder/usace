var gulp = require('gulp'),
  gutil = require('gulp-util'),
  concat = require('gulp-concat');

var jsFiles = [
  'builds/dev/js/modernizr-custom.js',
  'builds/dev/js/main.js'
];

gulp.task('log', function(){
  gutil.log('US Army Corp Eng Running >');
});

gulp.task('js', function(){
  gulp.src(jsFiles)
    .pipe(concat('prod.js'))
    .pipe(gulp.dest('builds/dev/js'))
});
