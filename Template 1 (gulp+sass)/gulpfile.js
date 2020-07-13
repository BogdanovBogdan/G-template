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
// const dist = "D://Program Files//Open Server//OSPanel//domains//";

const htmlPath = "./src/index.html";
function html(done) {
	return gulp.src(htmlPath)
		.pipe(gulp.dest(dist))
		.pipe(browserSync.stream());
	done();
};

const cssPath = "./src/css/*.css";
function css(done) {
	return gulp.src(cssPath)
		.pipe(concat('style.min.css'))
		.pipe(cleanCss())
		.pipe(gulp.dest(dist + "/css"))
		.pipe(browserSync.stream());
	done();
};

const jsPath = "./src/js/**/script.js";
function js(done) {
	return gulp.src(jsPath)
		.pipe(terser())
		.pipe(gulp.dest(dist + "/js"))
		.pipe(browserSync.stream());
	done();
};

const copySrcPaths = ["./src/**/*.*", "!./src/sass/**/*.*", "!./src/css/*.css", "!./src/js/*.js"];
function copySrc(done) {
	return gulp.src(copySrcPaths)
		.pipe(gulp.dest(dist))
		.on("end", browserSync.reload);
	done();
};

const sassToCssPath = "./src/sass/**/*.sass";
function sassToCss(done) {
	gulp.src(sassToCssPath)
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
		server: dist,
		port: 4000,
		notify: true
	});

	gulp.watch(htmlPath, html);
	gulp.watch(sassToCssPath, sassToCss);
	gulp.watch(cssPath, css);
	gulp.watch(jsPath, js);
	gulp.watch(copySrcPaths, copySrc);
});

gulp.task("build", gulp.parallel(html, sassToCss, css, js, copySrc));
gulp.task("default", gulp.parallel("watch", "build"));


gulp.task('clean', () => {
	return del("./**/.gitkeep");
});