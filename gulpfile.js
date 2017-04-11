var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var jade = require('gulp-jade');
var wait = require('gulp-wait');

gulp.task('sass', function () {
  return gulp.src(['app/sass/main.scss', 'app/sass/libs.scss'])
    .pipe(wait(200))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({browsers: ['last 15 versions', '> 1%', 'ie 9'], cascade: true }))
    .pipe(gulp.dest('app/css'));
});

gulp.task('jade', function () {
  return gulp.src(['app/jade/*.jade', '!app/jade/**/_*.jade'])
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('app'))
});

gulp.task('scripts', function () {
  return gulp.src(['app/libs/jquery/dist/jquery.min.js', , 'app/libs/bootstrap-sass/assets/javascripts/bootstrap.min.js'])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function () {
  return gulp.src('app/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
});

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('clean', function () {
  return del.sync('dist');
});

gulp.task('watch', ['browser-sync', 'jade', 'css-libs', 'scripts'], function () {
  gulp.watch('app/sass/**/*.scss', ['sass']);
  gulp.watch('app/jade/**/*.jade', ['jade']);
  gulp.watch('app/css/**/*.css', browserSync.reload);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'sass', 'scripts'], function () {
  var buildCSS = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  var buildScripts = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'));

  var buildImages = gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));

  var buildHTML = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});