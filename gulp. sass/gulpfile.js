const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

function sync(done) {
   browserSync.init({
      server: {
         baseDir: "./src"
      }
   });
   gulp.watch("src/sass/*.sass", convertToSass);
   gulp.watch("src/*.html").on('change', browserSync.reload);
   gulp.watch("src/js/*.js").on('change', browserSync.reload);
 
   done();
}

function convertToSass(done) {
   gulp.src("src/sass/*.sass")
      .pipe(sass({
         errorLogToConsole: true
      }))
      .on('error', console.error.bind(console))
      .pipe(autoprefixer({
         cascade: false,
         overrideBrowserslist: ["last 3 versions"]
      }))
      .pipe(gulp.dest("src/css"))
      .pipe(browserSync.stream());

   done();
}

gulp.task('default', sync);