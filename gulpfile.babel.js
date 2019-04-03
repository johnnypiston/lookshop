'use strict';

import gulp from 'gulp';
import del from 'del';
import fileinclude from 'gulp-file-include';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import sassCompiler from 'node-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import webpackStream from 'webpack-stream';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import browserSync from 'browser-sync';
import gulpif from 'gulp-if';
import yargs from 'yargs';

sass.compiler = sassCompiler;
const argv = yargs.argv;

const PATHS = {
  HTML: {
    BASEPATH: './src/html/',
    SRC: 'src/html/pages/**/*.html',
    DEST: 'build',
  },
  STYLES: {
    SRC: 'src/styles/styles.scss',
    DEST: 'build/resources/styles',
  },
  JS: {
    SRC: 'src/js/scripts.js',
    DEST: 'build/resources/js',
  },
  ASSETS: {
    SRC: 'src/assets/**/*.*',
    DEST: 'build/resources',
  },
  SVG: {
    SRC: 'src/assets/svg/*.svg',
    DEST: 'src/html/blocks/common',
  },
  VENDOR_STYLES: 'src/vendor-styles/*.css',
};

export const html = function() {
  return gulp
    .src(PATHS.HTML.SRC)
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: PATHS.HTML.BASEPATH,
      })
    )
    .pipe(gulp.dest(PATHS.HTML.DEST))
    .pipe(browserSync.stream());
};

export const styles = function() {
  return gulp
    .src([PATHS.VENDOR_STYLES, PATHS.STYLES.SRC])
    .pipe(plumber())
    .pipe(gulpif(!argv.prod, sourcemaps.init()))
    .pipe(concat('styles.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(!argv.prod, autoprefixer({ browsers: ['last 2 versions'] })))
    .pipe(gulpif(!argv.prod, sourcemaps.write()))
    .pipe(gulp.dest(PATHS.STYLES.DEST))
    .pipe(browserSync.stream());
};

export const js = function() {
  return gulp
    .src(PATHS.JS.SRC)
    .pipe(plumber())
    .pipe(gulpif(!argv.prod, sourcemaps.init()))
    .pipe(
      webpackStream({
        mode: 'production',
        output: {
          filename: 'scripts.js',
        },
      })
    )
    .pipe(gulpif(!argv.prod, sourcemaps.write()))
    .pipe(gulp.dest(PATHS.JS.DEST))
    .pipe(browserSync.stream());
};

export const svgsprite = function() {
  return gulp
    .src(PATHS.SVG.SRC)
    .pipe(plumber())
    .pipe(
      svgmin(function() {
        return {
          plugins: [
            { removeDimensions: true },
            { removeViewBox: false },
            {
              removeAttrs: {
                attrs: 'fill',
              },
            },
            {
              cleanupNumericValues: {
                floatPrecision: 0,
              },
            },
          ],
        };
      })
    )
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(PATHS.SVG.DEST))
    .pipe(browserSync.stream());
};

export const assets = function() {
  return gulp
    .src(PATHS.ASSETS.SRC, { since: gulp.lastRun(assets) })
    .pipe(gulp.dest(PATHS.ASSETS.DEST))
    .pipe(browserSync.stream());
};

export const server = function() {
  browserSync.init({
    server: 'build',
  });

  gulp.watch('build/**/*.*', browserSync.reload);
};

export const watch = function() {
  gulp.watch('src/html/**/*.html', html);
  gulp.watch('src/styles/**/*.scss', styles);
  gulp.watch('src/js/**/*.js', js);
  gulp.watch('src/assets/svg/**/*.svg', svgsprite);
  gulp.watch('src/assets/img/**/*.*', assets);
};

export const clean = () => del(['build']);

export const build = gulp.series(
  svgsprite,
  gulp.parallel(html, styles, js, assets)
);

export const dev = gulp.series(build, gulp.parallel(server, watch));

export default dev;
