var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var printExample = require('./lib/print-example');
var _ = require('lodash');

gulp.task('mocha',mochaTask);
gulp.task('coverage',coverage());
gulp.task('coverage-api',coverage({grep:'@api'}));

gulp.task('watch-mocha',function(){
  gulp.watch(['test/**','src/**','examples/**'],['mocha']);
  mochaTask();
});

gulp.task('example',function(){
  printExample.logExample(require('./examples/col-and-row-span-examples'));
});

/**
 * Do NOT run this in the same commit when you are adding images.
 * Commit the images, then run this.
 */
gulp.task('example-md',function(cb){
  printExample.mdExample(require('./examples/col-and-row-span-examples'),'example.md',cb);
});

function coverage(opts){
  opts = opts || {};

  function coverageTask(cb){
    gulp.src(['src/*.js'])
      .pipe(istanbul()) // Covering files
      .pipe(istanbul.hookRequire()) // Force `require` to return covered files
      .on('error', logMochaError)
      .on('finish', function () {
        gulp.src(['test/*.js'])
          .pipe(mocha(opts))
          .on('error',function(err){
            logMochaError(err);
            if(cb) cb(err);
          })
          .pipe(istanbul.writeReports()) // Creating the reports after tests run
          .on('end', function(){
            if(cb) cb();
          });
      });
  }

  return coverageTask;
}

function mochaTask(){
  return gulp.src(['test/*.js'],{read:false})
    .pipe(mocha({
      growl:true
    }))
    .on('error',logMochaError);
}

function logMochaError(err){
  if(err && err.message){
    gutil.log(err.message);
  } else {
    gutil.log.apply(gutil,arguments);
  }
}