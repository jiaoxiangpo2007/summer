/**
 * Created by jiaox on 2017/2/25.
 */
'use strict';
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jsonminify = require('gulp-jsonminify');
/*清理文件*/
gulp.task('default1',function () {
    return gulp
        .src("resource/*.json")
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'))
});

gulp.task('default', function () {
    return gulp
        .src('resource/*.json')
        .pipe(jsonminify())
        .pipe(gulp.dest('./dist/'))
})