const gulp = require('gulp');
const sass = require('gulp-sass');
//const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
//const gzip = require('gulp-gzip');
//const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const htmlmin = require('gulp-htmlmin');

gulp.task('clean', function () {
  console.log("Clean all files in distribution folder.");
  return del([
    'dist/**/*',
  ]);
});

gulp.task('copy-index', function() {
  return gulp.src('public/index.html')
    .pipe(htmlmin({collapseWhitespace: true, html5: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-third-party', function() {
  return gulp.src('public/third-party/**/*')
    .pipe(gulp.dest('dist/third_party'));
});

gulp.task('copy-restaurant', function() {
  return gulp.src('public/restaurant.html')
    //.pipe(htmlmin({collapseWhitespace: true, html5: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-images', function() {
  return gulp.src('public/imgs/**/*')
    .pipe(gulp.dest('dist/imgs'));
});

gulp.task('styles', function() {
  return gulp.src('public/sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    //.pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('modules', function() {
  return gulp.src(['public/idb.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('other', function() {
  return gulp.src(['public/*.json', 'public/*.ico'])
    .pipe(gulp.dest('dist'));
});

gulp.task('sw', function() {
  return gulp.src(['public/sw.js'])
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts-dist', function() {
  return gulp.src('public/js/**/*.js')
    .pipe(sourcemaps.init())
    //.pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('dist', gulp.series(
  'styles',
  'copy-index',
  'copy-restaurant',
  'copy-images',
  'modules',
  'scripts-dist',
  'other'
));

gulp.task('default', gulp.series(
  'clean',
  'copy-third-party',
  'sw',
  'styles',
  'copy-index',
  'copy-restaurant',
  'copy-images',
  'modules',
  'scripts-dist',
  'other'
));

gulp.task('watch', gulp.series('default', 'other', function() {
  gulp.watch('public/sass/**/*.scss', gulp.series('styles'));
  gulp.watch('public/index.html', gulp.series('copy-index'));
  gulp.watch('public/restaurant.html', gulp.series('copy-restaurant'));
  gulp.watch('public/sw.js', gulp.series('sw'));
  gulp.watch('public/js/**/*.js', gulp.series('scripts-dist'));
}));
