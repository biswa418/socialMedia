const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');

const uglify = require('gulp-uglify-es').default;

gulp.task('css', async function (done) {
    console.log('minifying css...');
    let { default: rev } = await import('gulp-rev');

    gulp.src('./assets/sass/**/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest('./assets/css'))

    gulp.src('./assets/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('js', async function (done) {
    console.log('minifying js...');
    let { default: rev } = await import('gulp-rev');
    gulp.src('./assets/**/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('images', async function (done) {
    console.log('minifying images...');
    let { default: rev } = await import('gulp-rev');
    let { default: imagemin } = await import('gulp-imagemin');

    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));

    done();
});

//empty the directory
gulp.task('clean:assets', async function (done) {
    (await import('del')).deleteSync(['public/assets/*/']);

    done();
});


gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function (done) {
    console.log('Building assets');
    done();
});
