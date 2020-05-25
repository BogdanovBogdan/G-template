"use stirct";

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const terser = require("gulp-terser");
const concat = require("gulp-concat");
const cleanCss = require("gulp-clean-css");
const del = require('del');

const dist = "./docs/";
// const dist = "D://Program Files//Open Server//OSPanel//domains//Agency.DK";

function html(done) {
	return gulp.src("./src/index.html")
		.pipe(gulp.dest(dist))
		.pipe(browserSync.stream());
	done();
};

function css(done) {
	return gulp.src("./src/css/*.css")
		.pipe(concat('style.min.css'))
		.pipe(cleanCss())
		.pipe(gulp.dest(dist + "/css"))
		.pipe(browserSync.stream());
	done();
};

function js(done) {
	return gulp.src("./src/js/**/script.js")
		.pipe(terser())
		.pipe(gulp.dest(dist + "/js"))
		.pipe(browserSync.stream());
	done();
};

function copySrc(done) {
	return gulp.src(["./src/**/*.*", "!./src/sass/*.sass", "!./src/css/*.css", "!./src/js/*.js"])
		.pipe(gulp.dest(dist))
		.on("end", browserSync.reload);
	done();
};

function sassToCss(done) {
	gulp.src("./src/sass/*.sass")
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
};

gulp.task("watch", () => {
	browserSync.init({
		server: "./dist",
		port: 4000,
		notify: true
	});

	gulp.watch("./src/index.html", html);
	gulp.watch("./src/sass/*.sass", sassToCss);
	gulp.watch("./src/css/*.*", css);
	gulp.watch("./src/js/**/*.js", js);
	gulp.watch(["./src/**/*.*", "!./src/sass/*.sass", "!./src/*.html", "!./src/css/*.css", "!./src/js/*.js"], copySrc);
});

gulp.task("build", gulp.parallel(html, sassToCss, css, js, copySrc));
gulp.task("default", gulp.parallel("watch", "build"));


gulp.task('clean', () => {
	return del("./**/.gitikeep");
});