'use strict';
const { src, dest, watch, series } = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const sass = require('gulp-sass');
const newer = require('gulp-newer');
const cssmin = require('gulp-cssmin');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const htmlreplace = require('gulp-html-replace');
const autoprefixer = require('gulp-autoprefixer');

const now = new Date();
const TM = '' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds();

const isJS = stream => stream.history[0].indexOf('.js')>0;

function copyHTML() {
	console.log('---------------COPYING SCSS---------------');
	return src('src/index.html')
    .pipe(dest('dist/'))
    .pipe(browserSync.stream());
}

// COPIES AND MINIFY IMAGE TO DIST
function copyImages() {
  console.log('---------------COPYING IMAGES---------------');
  return src('src/assets/img/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(newer('dist/assets/img/'))
    // .pipe(imagemin())
    .pipe(dest('dist/assets/img/'))
    .pipe(browserSync.stream());
}

// COMPILE SCSS INTO CSS
function compileSCSS() {
  console.log('---------------COMPILING SCSS---------------');
  return src(['src/assets/scss/*.scss', 'src/assets/scss/*.css'])
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(dest('dist/assets/css'))
    .pipe(browserSync.stream());
}

function compileJS() {
  console.log('---------------COMPILE CUSTOM.JS---------------');
  return src(['src/assets/js/*.js', 'src/assets/js/**/*.js'])
    .pipe(babel())
    .pipe(dest('dist/assets/js/'))
    .pipe(browserSync.stream());
}



// JS LINTER
function jsLint() {
  return src('src/assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

// DELETE DIST FOLDER
function cleanDist(done) {
  console.log('---------------REMOVING OLD FILES FROM DIST---------------');
  del.sync('dist');
  return done();
}


// WATCH FILES
function watchFiles() {
  watch('src/**/*.html', copyHTML);
  watch(['src/assets/scss/**/*.scss', 'src/assets/scss/*.scss', 'src/assets/scss/*.css'] , compileSCSS);
  watch('src/assets/js/*.js', series(jsLint, compileJS));
}


// BROWSER SYNC
function browserSyncInit(done) {
  console.log('---------------BROWSER SYNC---------------');
  browserSync.init({
    server: './dist'
  });
  return done();
}


// COPY VENDOR FILES
function copyVendor() {
  console.log('---------------COPY JAVASCRIPT VENDOR FILES INTO DIST---------------');
  return src([
      'src/assets/vendor/**/*',
    ])
    .pipe(dest('dist/assets/vendor'))
    .pipe(browserSync.stream());
}


// ------------ PRODUCTION TASKS -------------

// CHANGE TO MINIFIED VERSIONS OF JS AND CSS
function renameSources() {
  console.log('---------------RENAMING SOURCES---------------');
  return src('dist/*.html')
    .pipe(htmlreplace({
      'js': {
        src: 'assets/js/main-' + TM + '.min.js',
        tpl: '<script src="%s" defer></script>'
      },
      'css': 'assets/css/main-' + TM + '.min.css'
    }))
    .pipe(dest('dist/'));
}

// CONCATINATE JS SCRIPTS
function concatScripts() {
  console.log('---------------CONCATENATE SCRIPTS---------------');
  return src([
      'src/assets/vendor/**/*.js',
      'dist/assets/js/temp.js'
    ])
    // .pipe(sourcemaps.init())
    .pipe(concat('main-' + TM + '.min.js'))
    // .pipe(sourcemaps.write('./'))
    .pipe(dest('dist/assets/js'))
    .pipe(browserSync.stream());
}

// MINIFY SCRIPTS
function minifyScripts() {
  console.log('---------------MINIFY SCRIPTS---------------');
  // return src('dist/assets/js/main.js')
  return src('src/assets/js/*.js')
    .pipe(babel())
    .pipe(concat('temp.js'))
    .pipe(uglify().on('error', console.error))
    .pipe(dest('dist/assets/js'));
}

// MINIFY CSS
function minifyCss() {
  console.log('---------------MINIFY CSS---------------');
  return src('dist/assets/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('main-' + TM + '.min.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(cssmin())
    .pipe(dest('dist/assets/css'));
}

// DEV
exports.dev = series(cleanDist, jsLint, copyVendor, copyImages, copyHTML, compileJS, compileSCSS, browserSyncInit, watchFiles);

// PROD
exports.prod = series(cleanDist, compileSCSS, copyImages, copyHTML, minifyScripts, concatScripts, minifyCss, renameSources);
