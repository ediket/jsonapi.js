var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');


gulp.task('default', ['concat:vendors']);


gulp.task('concat:vendors', function() {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('build-bower/vendors.js'))
});
