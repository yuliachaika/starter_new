"use strict";
const gulp          = require('gulp'),
      sass          = require('gulp-sass'),
      sourcemaps    = require('gulp-sourcemaps'),
      browserSync   = require('browser-sync'),
      autoprefixer  = require('gulp-autoprefixer'),
      pump          = require('pump'),
      concat        = require("gulp-concat"),
      imagemin      = require('gulp-imagemin'), 
      pngquant      = require('imagemin-pngquant'),
      cache         = require('gulp-cache'),
      rename        = require("gulp-rename"),
      uglify        = require('gulp-uglify-es').default,
      wiredep       = require('wiredep')({ 
        directory: './assets/components'
      });

const PATH = wiredep;

const compatability = [
    'last 3 versions',
    'iOS 7'
];

//Compile scss to css
gulp.task('sass', function () {
    return gulp.src('./assets/src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(
            {outputStyle: 'compressed',
            includePaths:PATH.scss}
        ).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: compatability,
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./assets/dist/css'));
});

//fonts
// gulp.task('fonts', function() {
//   return gulp.src('node_modules/font-awesome/fonts/*')
//     .pipe(gulp.dest('./assets/dist/fonts'))
// })

//js
// gulp.task('javascript', function () {
//     return gulp.src("assets/src/javascript/main.js")
//         .pipe(concat('global.js'))
//         .pipe(rename("global.min.js"))
//         .pipe(uglify())
//         .pipe(gulp.dest("assets/dist/javascript"));
// });

//js
gulp.task('javascript', function() {
    return gulp.src(['assets/src/javascript/plugins/*.js',
      'assets/src/javascript/global.js'])
        .pipe(concat('global.js'))
        .pipe(rename("global.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest('assets/dist/javascript'));
});

//img
gulp.task('img', function() {
    return gulp.src('./assets/src/img/**/*') 
        .pipe(cache(imagemin({ 
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: true}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('./assets/dist/img')); 
});


gulp.task('browser-sync', function () {
    browserSync.init(['./*.html', './assets/dist/css/style.css'], {
        server: {
            baseDir: "./" 
        }
    });
});

gulp.task('default', ['sass', 'img', 'javascript', 'browser-sync'], function () {
    gulp.watch('./assets/src/scss/**/*.scss', ['sass']);
    gulp.watch('./assets/src/img/*', ['img']);
    gulp.watch('./assets/src/javascript/**/*.js', ['javascript']);
});