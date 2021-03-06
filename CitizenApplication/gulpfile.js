var gulp = require('gulp'),
  gulpWatch = require('gulp-watch'),
  gutil = require('gulp-util'),
  rename = require('gulp-rename'),
  del = require('del'),
  runSequence = require('run-sequence'),
  tslint = require("gulp-tslint"),
  argv = process.argv,
  test = require('./test/test');

/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');

// This function copies our fonts to the build folder.
// Author: Dominik Skalnik, 5.5.2016
var copyDigitaleDoerferFonts = function (options) {
  options.src = options.src || 'resources/fonts/**/*.+(ttf|woff|woff2|otf)';
  options.dest = options.dest || 'www/build/fonts';

  return gulp.src(options.src)
    .pipe(gulp.dest(options.dest));
};

var isRelease = argv.indexOf('--release') > -1;

gulp.task('watch', ['clean'], function (done) {
  runSequence(
    ['sass', 'html', 'fonts', 'scripts', 'lang', 'modifyConfig'],
    function () {
      gulpWatch('app/**/*.scss', function () { gulp.start('sass'); });
      gulpWatch('app/**/*.html', function () { gulp.start('html'); });
      gulpWatch('app/**/lang.json', function () { gulp.start('lang'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
  );
});

gulp.task('build', ['clean'], function (done) {
  runSequence(
    ['sass', 'html', 'fonts', 'scripts', 'lang', 'modifyConfig'],
    function () {
      var error = 0;
      buildBrowserify({
        minify: isRelease,
        browserifyOptions: {
          debug: !isRelease
        },
        onError: function (err) {
          console.error(err.toString());
          error = 1;
        },
        uglifyOptions: {
          mangle: false
        }
      }).on('end', function () {
        done(error);
      });
    }
  );
});

// Added by skaldo on 6.5.2016
// Testing tasks
gulp.task('test', test.karma);
gulp.task('karma-debug', test.karmaDebug);
// Added by skaldo on 14.05.2016
gulp.task('lint', function (done) {
  return gulp.src(["app/**/**.ts", "app/**/**.spec.ts"])
    .pipe(tslint({}))
    .pipe(tslint.report('verbose'));
});
gulp.task('pre-commit', function (done) {
  runSequence(['lint'], function () {
    var error = 0;
    buildBrowserify({
      minify: false,
      browserifyOptions: {
        debug: false
      },
      onError: function (err) {
        console.error(err.toString());
        error = 1;
      },
      uglifyOptions: {
        mangle: false
      },
      tsifyOptions: {
      }
    }).on('end', function () {
      done(error);
    });
  })
});
gulp.task('beforeCommit', ['pre-commit']);

// Added by skaldo on the 15.05.2016
var typedoc = require("gulp-typedoc");
gulp.task("typedoc", function () {
  return gulp
    .src(["app/**/**.ts", "!app/**/**.spec.ts"])
    .pipe(typedoc({
      module: "commonjs",
      target: "es5",
      out: "docs/",
      name: "Citizen Application",
      ignoreCompilerErrors: true,
      //includeDeclarations: true,
      mode: "file",
      hideGenerator: true
    }))
    ;
});

// Added by skaldo on the 29.05.2016
// Support for the translations.
// Feel free to make this more generic.
var extend = require('gulp-extend');
var wrap = require('gulp-wrap');
var jsonFormat = require('gulp-json-format');
gulp.task("lang", function () {
  var supportedLanguages = ['en', 'de'];
  var mergeFn = function (language) {
    gulp.src('app/**/lang.json')
      .pipe(wrap('{"<%= contents.prefix %>": <%= JSON.stringify(contents.' + language + ') %>}'), {}, { parse: false })
      .pipe(extend(language + '.json'))
      .pipe(jsonFormat(2))
      .pipe(gulp.dest('www/lang'));
  }
  for (var i = 0; i < supportedLanguages.length; i++) {
    mergeFn(supportedLanguages[i]);
  }
  gulp.src('www/lang/*.json')
    .pipe(jsonFormat(2))
    .pipe(gulp.dest('www/lang'));
})

// Added by skaldo on the 15.06.2016
// Travis adds the changeset to the config
var replace = require('gulp-replace');
gulp.task("modifyConfig", function () {
  // Copy the default config and replace the required properties.
  gulp.src('www/config.default.js')
    .pipe(replace('#TRAVIS_BUILD_NUMBER#', gutil.env.TRAVIS_BUILD_NUMBER || 'localBuild'))
    .pipe(replace('#TRAVIS_COMMIT#', gutil.env.TRAVIS_BUILD_NUMBER || 'localBuild'))
    .pipe(replace('release: false', 'release: ' + gutil.env.TRAVIS))
    .pipe(rename({ basename: 'config'}))
    .pipe(gulp.dest('www'));
});

gulp.task('sass', buildSass);
gulp.task('html', copyHTML);
gulp.task('ionicFonts', copyFonts);
gulp.task('digitaleDoerferFonts', copyDigitaleDoerferFonts);
gulp.task('fonts', ['ionicFonts', 'digitaleDoerferFonts']);
gulp.task('scripts', copyScripts);
gulp.task('clean', function () {
  return del('www/build');
});
