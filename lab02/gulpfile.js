const gulp = require('gulp');
const concatenate = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const autoPrefix = require('gulp-autoprefixer');
const gulpSASS = require('gulp-sass');
const rename = require('gulp-rename');
const imagemin = require("gulp-imagemin")
const uglify = require('gulp-uglify')
const sassFiles = [
    './scss/variables.scss',
    './scss/custom.scss',
    './src/styles/bootstrap/scss/_variables.scss'
];

const vendorJsFiles = [
    './node_modules/jquery/dist/jquery.js',
    './src/styles/bootstrap/dist/js/bootstrap.js'
];

gulp.task('imagemin', function(done) {
    gulp
        .src('./static/*.jpg')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/images/'));
    done();
});

gulp.task('sass', function(done) {
    gulp
        .src(sassFiles)
        .pipe(gulpSASS())
        .pipe(concatenate('styles.css'))
        .pipe(gulp.dest('./public/css/'))
        .pipe(autoPrefix())
        .pipe(cleanCSS())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('./public/css/'));
    done();
});

gulp.task('js:vendor', function(done) {
    gulp
        .src(vendorJsFiles)
        .pipe(concatenate('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
    done();
});

gulp.task('build', gulp.parallel(['sass', 'js:vendor']));


gulp.task('default', gulp.series('build'));