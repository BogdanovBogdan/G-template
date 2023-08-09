'use stirct';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const cleanCss = require('gulp-clean-css');
const del = require('del');
const htmlreplace = require('gulp-html-replace');
const rename = require('gulp-rename');

const buildDir = './build/';
const devDir = './src/';

const htmlPath = './src/index.html';
const cssPath = './src/css/*.css';
const jsPath = './src/js/**/script.js';
const sassToCssPath = './src/sass/**/*.scss';
const copySrcPaths = [
  './src/**/*.*',
  `!${htmlPath}`,
  `!${cssPath}`,
  `!${jsPath}`,
  `!${sassToCssPath}`,
];

const build = (done) => {
  function sassToCss() {
    return gulp
      .src(sassToCssPath)
      .pipe(
        sass({
          errorLogToConsole: true,
        })
      )
      .on('error', console.error.bind(console))
      .pipe(
        autoprefixer({
          cascade: false,
          overrideBrowserslist: ['last 3 versions'],
        })
      )
      .pipe(cleanCss())
      .pipe(rename({ suffix: '.min'}))
      .pipe(gulp.dest(buildDir + '/css'))
  }
  
  function html() {
    return gulp
      .src(htmlPath)
      .pipe(
        htmlreplace({
          stylesheet: './css/styles.min.css',
        })
      )
      .pipe(gulp.dest(buildDir));
  }

  function js() {
    return gulp
      .src(jsPath)
      .pipe(terser()) // compressor
      .pipe(gulp.dest(buildDir + '/js'));
  }

  function copySrc() {
    return gulp.src(copySrcPaths).pipe(gulp.dest(buildDir));
  }

  function cleanFolder() {
    return del(buildDir);
  }

  async function run() {
    await cleanFolder();
    sassToCss();
    html();
    js();
    copySrc();
  }
  run();

  done();
};

const serve = (done) => {
  function html() {
    return gulp.src(htmlPath).pipe(browserSync.stream());
  }

  function css() {
    return gulp.src(cssPath).pipe(browserSync.stream());
  }

  function js() {
    return gulp.src(jsPath).pipe(browserSync.stream());
  }

  function sassToCss() {
    return gulp
      .src(sassToCssPath)
      .pipe(
        sass({
          errorLogToConsole: true,
        })
      )
      .on('error', console.error.bind(console))
      .pipe(
        autoprefixer({
          cascade: false,
          overrideBrowserslist: ['last 3 versions'],
        })
      )
      .pipe(gulp.dest('src/css'))
      .pipe(browserSync.stream());
  }

  function watch() {
    browserSync.init({
      server: devDir,
      port: 4000,
      open: false,
    });

    html();
    css();
    js();
    sassToCss();

    gulp.watch(htmlPath, html);
    gulp.watch(cssPath, css);
    gulp.watch(jsPath, js);
    gulp.watch(sassToCssPath, sassToCss);
  }
  watch();

  done();
};

gulp.task('clean', () => {
  return del('./**/.gitkeep');
});

gulp.task('build', build);
gulp.task('default', serve);
