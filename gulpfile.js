var gulp = require('gulp'),
    path = require('path'),
    gulpModules = {},
    modulePath,
    projectName = 'projectName';

function includeDependencies() {

    if (process.platform === "win32") {
        modulePath = 'C:/Users/valera.siestov/AppData/Roaming/npm/';
    } else {
        modulePath = '/usr/local/lib/node_modules/';
    }

    gulpModules.livereload = require(modulePath + 'gulp-livereload');
}

function getFtpConnection() {
    var ftp = gulpModules.ftp || require(modulePath + 'vinyl-ftp');

    return ftp.create(require('./ftp.json'));
}

function ftpHandler() {
    var conn = getFtpConnection(),
        notify = gulpModules.notify || require(modulePath + "gulp-notify");

    gulpModules.notify = notify;

    return gulp.src('build/**/*.*', {buffer: false})
        .pipe(notify({
            message: "Everything has been uploaded",
            onLast: true
        }))
        .pipe(conn.newer('/' + projectName))
        .pipe(conn.dest('/' + projectName))
}

includeDependencies();

gulp.task('default', ['jade', 'jade-pretty', 'sass', 'js'], ftpHandler);

gulp.task('full', ['jade', 'jade-pretty', 'sass', 'js', 'js-lib', 'copy'], ftpHandler);

gulp.task('jd', ['jade', 'jade-pretty'], ftpHandler);

gulp.task('ss', ['sass'], ftpHandler);

gulp.task('fonts', ['ttf2woff', 'ttf2woff2']);

gulp.task('jade', function() {
    var jade = gulpModules.jade || require(modulePath + 'jade'),
        data = gulpModules.data || require(modulePath + 'gulp-data'),
        gulpJade = gulpModules.gulpJade || require(modulePath + 'gulp-jade');

    gulpModules.jade = jade;
    gulpModules.data = data;
    gulpModules.gulpJade = gulpJade;

    gulp.src(['views/*.jade', '!views/layout.jade', '!views/error.jade'])
        .pipe(data(function (file) {
            var pages = require('./pages.json'),
                pageName = path.basename(file.path).replace('.jade', ''),
                pageData = pages[pageName] || {};

            pageData.page.name = pageName;

            if (pageData.build) {
                pageData.build.production = true;
            } else {
                pageData.build = {
                    production: true
                };
            }

            return pageData;
        }))
        .pipe(gulpJade({
            jade: jade,
            pretty: false
        }))
        .pipe(gulp.dest('build/'));

});

gulp.task('jade-local', function () {
    var jade = gulpModules.jade || require(modulePath + 'jade'),
        gulpJade = gulpModules.gulpJade || require(modulePath + 'gulp-jade');

    gulpModules.jade = jade;
    gulpModules.gulpJade = gulpJade;

    gulp.src(['public/server/**/*.jade'])
        .pipe(gulpJade({
            jade: jade,
            pretty: true
        }))
        .pipe(gulp.dest('public/server/'));
});

gulp.task('jade-pretty', function() {
    var jade = gulpModules.jade || require(modulePath + 'jade'),
        data = gulpModules.data || require(modulePath + 'gulp-data'),
        gulpJade = gulpModules.gulpJade || require(modulePath + 'gulp-jade'),
        rename = gulpModules.rename || require(modulePath + 'gulp-rename');

    gulpModules.jade = jade;
    gulpModules.data = data;
    gulpModules.gulpJade = gulpJade;
    gulpModules.rename = rename;

    gulp.src(['views/*.jade', '!views/layout.jade', '!views/error.jade'])
        .pipe(data(function (file) {
            var pages = require('./pages.json'),
                pageName = path.basename(file.path).replace('.jade', ''),
                pageData = pages[pageName] || {};

            if (pageData.build) {
                pageData.build.production = true;
            } else {
                pageData.build = {
                    production: true
                };
            }

            pageData.page.name = pageName;

            return pages[pageName] || {};
        }))
        .pipe(gulpJade({
            jade: jade,
            pretty: true
        }))
        .pipe(rename({
            extname: '.uncompressed.html'
        }))
        .pipe(gulp.dest('build/'));

});

gulp.task('sass', function () {
    var sourcemaps = gulpModules.sourcemaps || require(modulePath + 'gulp-sourcemaps'),
        sass = gulpModules.sass || require(modulePath + 'gulp-sass'),
        postCss = gulpModules.postCss || require(modulePath + 'gulp-postcss'),
        autoprefixer = gulpModules.autoprefixer || require(modulePath + 'autoprefixer');

    gulpModules.sourcemaps = sourcemaps;
    gulpModules.sass = sass;
    gulpModules.postCss = postCss;
    gulpModules.autoprefixer = autoprefixer;

    gulp.src('public/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(postCss([autoprefixer({browsers: ['last 5 version']})]))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/css'))
        .pipe(gulpModules.livereload());

});

gulp.task('js', function () {

    var sourcemaps = gulpModules.sourcemaps || require(modulePath + 'gulp-sourcemaps'),
        rename = gulpModules.rename || require(modulePath + 'gulp-rename'),
        concat = gulpModules.concat || require(modulePath + 'gulp-concat'),
        uglify = gulpModules.uglify || require(modulePath + 'gulp-uglify');

    gulpModules.sourcemaps = sourcemaps;
    gulpModules.rename = rename;
    gulpModules.concat = concat;
    gulpModules.uglify = uglify;

    return gulp.src(['!public/js/jquery.mains.js', 'public/js/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/js/'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/js'))
});

gulp.task('js-lib', function () {
    var sourcemaps = gulpModules.sourcemaps || require(modulePath + 'gulp-sourcemaps'),
        rename = gulpModules.rename || require(modulePath + 'gulp-rename'),
        concat = gulpModules.concat || require(modulePath + 'gulp-concat'),
        uglify = gulpModules.uglify || require(modulePath + 'gulp-uglify');

    gulpModules.sourcemaps = sourcemaps;
    gulpModules.rename = rename;
    gulpModules.concat = concat;
    gulpModules.uglify = uglify;

    return gulp.src('public/js/lib/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('build/js/lib/'))
        .pipe(rename('lib.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/js/lib/'));
});

gulp.task('copy', function () {
    gulp.src(['public/fonts/**/*.*'])
        .pipe(gulp.dest('build/fonts'));

    gulp.src(['public/img/**/*.*'])
        .pipe(gulp.dest('build/img'));

    gulp.src(['public/pic/**/*.*'])
        .pipe(gulp.dest('build/pic'));

    gulp.src(['public/server/**/*.*'])
        .pipe(gulp.dest('build/server'));
});

gulp.task('postcss', function () {
    var autoprefixer = gulpModules.autoprefixer || require(modulePath + 'autoprefixer'),
        postCss = gulpModules.postCss || require(modulePath + 'gulp-postcss');

    gulpModules.autoprefixer = autoprefixer;
    gulpModules.postCss = postCss;

    return gulp.src('public/css/*.css')
        .pipe(postCss([autoprefixer({browsers: ['last 5 version']})]))
        .pipe(gulp.dest('public/css'));
});

gulp.task('sprites', function () {
    var sprite = gulpModules.sprite || require(modulePath + 'css-sprite').stream,
        gulpif = gulpModules.gulpif || require(modulePath + 'gulp-if');

    gulpModules.sprite = sprite;
    gulpModules.gulpif = gulpif;

    return gulp.src('public/img/ico/*.png')
        .pipe(sprite({
            name: 'ico',
            style: '_sprite.scss',
            cssPath: '../img/',
            processor: 'scss'
        }))
        .pipe(gulpif('*.png', gulp.dest('public/img/'), gulp.dest('public/sass/')))
});

gulp.task('watch', function() {
    gulpModules.livereload.listen();

    gulp.watch('public/server/*.jade', ['jade-local']);

    gulp.watch('public/js/*.js').on('change', function (event) {
        gulpModules.livereload.changed(event.path)
    });

    gulp.watch('views/**/*.jade').on('change', function (event) {
        gulpModules.livereload.changed(event.path)
    });

    gulp.watch('public/css/*.css').on('change', function (event) {
        gulpModules.livereload.changed(event.path)
    });

    gulp.watch('public/img/ico/*.png', ['sprites']);
});

gulp.task('ttf2woff', function() {
    var ttf2woff = require(modulePath + 'gulp-ttf2woff');

    gulp.src(['public/fonts/*.ttf'])
        .pipe(ttf2woff())
        .pipe(gulp.dest('public/fonts/'));
});

gulp.task('ttf2woff2', function() {
    var ttf2woff2 = require(modulePath + 'gulp-ttf2woff2');

    gulp.src(['public/fonts/*.ttf'])
        .pipe(ttf2woff2())
        .pipe(gulp.dest('public/fonts/'));
});

gulp.task('ftp', ftpHandler);

gulp.task('valid', function() {
    var validator = gulpModules.validator = require(modulePath + 'gulp-html');

    gulpModules.validator = validator;

    return gulp.src('build/*.uncompressed.html')
        .pipe(validator())
        .pipe(gulp.dest('validate-result/'));
});

gulp.task('readme', function () {
    var fs = require('fs');

    fs.readFile('pages.json', 'utf-8', function (err, data) {
        var json = JSON.parse(data),
            links = [],
            item,
            index = 1;

        for (item in json) {

            if (json.hasOwnProperty(item)) {
                links.push(index + '. [' + json[item].page.title + '](http://demo3.frondevo.com/' + projectName + '/' + item + '.html)')
                index++;
            }

        }

        fs.appendFile('README.md', links.join('\r\n'), 'utf-8');
    })
});

gulp.task('git', function () {
    var git = gulpModules.git || require(modulePath + 'gulp-git'),
        prompt = gulpModules.prompt || require(modulePath + 'gulp-prompt'),
        notify = gulpModules.notify || require(modulePath + "gulp-notify");

    gulpModules.git = git;
    gulpModules.prompt = prompt;
    gulpModules.notify = notify;

    gulp.src([''])
        .pipe(prompt.prompt({
            type: 'input',
            name: 'message',
            message: 'Input commit message: '
        }, function (res){

            var gitChunkStream = gulp.src([])
                .pipe(git.add({args: '--all'}))
                .pipe(git.add({args: '--all', cwd: './build/'}))
                .pipe(git.commit(res.message)).on('error', function () {
                    this.emit("end");
                })
                .pipe(git.commit(res.message, {cwd: './build/'})).on('error', function () {
                    this.emit("end");
                });

            gitChunkStream.on('end', function () {

                git.push('origin', 'master', {}, function (err) {

                    if (err) {
                        console.log(err);
                    }

                    gulp.src('.')
                        .pipe(notify({
                            message: "Changes have been pushed",
                            onLast: true
                        }));
                });

                git.push('origin', 'master', {cwd: './build/'}, function (err) {

                    if (err) {
                        console.log(err);
                    }

                    gulp.src('.')
                        .pipe(notify({
                            message: "Build has been pushed",
                            onLast: true
                        }));
                });
            });

        }));

});