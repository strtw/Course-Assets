var gulp = require('gulp');
var map = require('map-stream');
var cleanCSS = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concatCss = require('gulp-concat-css');
var rename = require('gulp-rename');
const jasmine = require('gulp-jasmine');
var rev = require('gulp-rev-append');
var bump = require('gulp-bump');
var git = require('gulp-git');
var htmlLint = require('gulp-html-lint');
const imagemin = require('gulp-imagemin');

///HELPERS///

var exitOnJshintError = map(function (file, cb) { // http://stackoverflow.com/questions/27852814/gulp-jshint-how-to-fail-the-build
    if (!file.jshint.success) {
        console.error('jshint failed'); //USED WITH lint TASK
        process.exit(1);
    }
});

///HTML///

gulp.task('htmlLinter', function() {
    return gulp.src('./dest/html/*.html')
        .pipe(htmlLint())
        .pipe(htmlLint.format())
        .pipe(htmlLint.failOnError());
});

gulp.task('html',['htmlLinter']);

///IMAGES///

gulp.task('img-min', function() {
    return gulp.src('img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dest/img'))
});

gulp.task('img',['img-min']);

///CSS///

gulp.task('sass', function () {
    return gulp.src('./sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./styles'));
});

gulp.task('concat-css',['sass'], function () { ///['sass'] is dependency syntax
    return gulp.src('styles/*.css')
        .pipe(concatCss("bundle.css"))
        .pipe(gulp.dest('dest/styles'));
});

gulp.task('minify-css',['concat-css'], function() {
    return gulp.src('dest/styles/bundle.css')
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dest/styles/'));
});

gulp.task('css',['sass','concat-css','minify-css']);



///JAVASCRIPT///

gulp.task('lint', function() {
    gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(exitOnJshintError);
});

gulp.task('scripts',['lint'], function() { //concatenate
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dest/js/'));
});


gulp.task('compress',['scripts'], function (cb) { //uglify
    pump([
            gulp.src('dest/js/*.js'),
            uglify(),
            gulp.dest('dest/js/')
        ],
        cb
    );
});

gulp.task('js',['lint','scripts','compress']);


///TESTING///

gulp.task('jasmine', () =>
gulp.src('spec/app/appSpec.js')
// gulp-jasmine works on filepaths so you can't have any plugins before it
    .pipe(jasmine({verbose: true}))
);

gulp.task('test',['jasmine']);

///VERSIONING///

gulp.task('rev', function() { //hash versioning for JS and CSS files
    gulp.src('./dest/html/index.html')
        .pipe(rev())
        .pipe(gulp.dest('./dest/html/'));
});

gulp.task('bump', function(){
    gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('version',['rev','bump']);


///GIT///

gulp.task('add', function(){
    return gulp.src('./')
        .pipe(git.add());
});

gulp.task('commit', ['add'],function(){
    return gulp.src('./')
        .pipe(git.commit('initial commit'));
});

gulp.task('push', ['commit'],function(){
    git.push('origin', 'master', function (err) {
        if (err) throw err;
    });
});

gulp.task('git',['add','commit','push']);

///DEPLOY///

gulp.task('deploy',['html','img','css','js','test','version','git']);


///DEFAULT///

gulp.task('default', function () {
  console.log('Gulp has run!');
});



//Fully lint our JavaScript  ****
//Compile our Sass ****
//Concatenate and minify JavaScript ***
//Concatenate and minify CSS ****
//Optimize Images ***
//Run Jasmine against our compiled JavaScript
//Update the version number in both `package.json` and `index.html`.
// Push our updates to git
//Lint html
//Exit on any failure