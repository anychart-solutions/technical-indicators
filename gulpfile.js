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
var prettyData = require('gulp-pretty-data');
var reload = browserSync.reload;

var config = {
    sourceDir: './src/',
    publicDir: './dist/'
};

/* Scripts task */
gulp.task('scripts', function () {
    return gulp.src(config.sourceDir + 'js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.sourceDir))
        .pipe(uglify())
        .pipe(gulp.dest(config.publicDir));
});

/* Styles task */
gulp.task('styles', function () {
    return gulp.src(config.sourceDir + '/sass/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(autoprefixer())
        .pipe(gulp.dest(config.sourceDir))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.publicDir))
});

/* HTML min */
gulp.task('minifyHtml', function () {
    return gulp.src(config.sourceDir + 'index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.publicDir));
});

/* JSON min */
gulp.task('minifyJson', function () {
    gulp.src([config.sourceDir + 'data/*.json'])
        .pipe(prettyData({
            type: 'minify',
            preserveComments: true
        }))
        .pipe(gulp.dest(config.publicDir + 'data/'))
});

/* XML min */
gulp.task('minifyXml', function () {
    gulp.src(config.sourceDir + '*.xml')
        .pipe(prettyData({
            type: 'minify',
            preserveComments: true
        }))
        .pipe(gulp.dest(config.publicDir))
});

// Static Server + watching scss/html files
gulp.task('serve', function () {

    browserSync.init({
        server: "./src/"
    });

    gulp.watch(config.sourceDir + 'sass/**/*.*', ['styles']);
    gulp.watch(config.sourceDir + 'js/**/*.*', ['scripts']);
    gulp.watch(config.sourceDir + 'data/**/*.json', ['minifyJson']);
    gulp.watch(config.sourceDir + '**/*.xml', ['minifyXml']);
    gulp.watch(config.sourceDir + 'index.html', ['minifyHtml']);

    gulp.watch(config.sourceDir + '*.css').on('change', browserSync.reload);
    gulp.watch(config.sourceDir + '*.js').on('change', browserSync.reload);
    gulp.watch(config.sourceDir + './data/*.json').on('change', browserSync.reload);
    gulp.watch(config.sourceDir + '*.xml').on('change', browserSync.reload);
    gulp.watch(config.sourceDir + "*.html").on('change', browserSync.reload);
});

/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['scripts', 'styles', 'serve', 'minifyJson', 'minifyXml', 'minifyHtml'], function () {
    /* Watch scss, run the sass task on change. */
    gulp.watch(config.sourceDir + 'sass/**/*.*', ['styles', 'bs-reload']);
    /* Watch app.js file, run the scripts task on change. */
    gulp.watch(config.sourceDir + 'js/**/*.*', ['scripts', 'bs-reload']);
    /* Watch .html files, run the bs-reload task on change. */
    gulp.watch([config.sourceDir + '*.html'], ['bs-reload']);
});

/* Production */
gulp.task('prod', ['scripts', 'styles', 'minifyJson', 'minifyXml', 'minifyHtml']);