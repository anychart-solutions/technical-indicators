var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var config = {
    sourceDir: './src/',
    publicDir: './dist/'
};

/* HTML min */
gulp.task('minifyHtml', function() {
    return gulp.src('./index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./'));
});

/* Scripts task */
gulp.task('scripts', function () {
    var jsDir = config.publicDir + 'js';

    return gulp.src(config.sourceDir + 'js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest(jsDir))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(jsDir));
});

/* Styles task */
gulp.task('styles', function () {
    var cssDir = config.publicDir + 'css';

    return gulp.src(config.sourceDir + '/sass/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(autoprefixer())
        .pipe(gulp.dest(cssDir))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(cssDir))
});

// Static Server + watching scss/html files
gulp.task('serve', function () {

    browserSync.init({
        server: "./"
    });

    gulp.watch('./index.html', ['minifyHtml']);
    gulp.watch(config.sourceDir + 'sass/**/*.*', ['styles']);
    gulp.watch(config.sourceDir + 'js/**/*.*', ['scripts']);
    gulp.watch(config.publicDir + 'css/*.css').on('change', browserSync.reload);
    gulp.watch(config.publicDir + 'js/*.js').on('change', browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);
});


/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['minifyHtml', 'scripts', 'styles', 'serve'], function () {
    /* Watch scss, run the sass task on change. */
    gulp.watch(config.sourceDir + 'sass/**/*.*', ['styles']);
    /* Watch app.js file, run the scripts task on change. */
    gulp.watch(config.sourceDir + 'js/**/*.*', ['scripts']);
    /* Watch .html files, run the bs-reload task on change. */
    gulp.watch(['*.html'], ['bs-reload']);
});