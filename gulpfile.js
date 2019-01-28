const { src, dest, parallel, watch } = require('gulp');
const browsersync = require("browser-sync").create();
const uglify = require('gulp-uglify');

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "."
    },
    port: 3000
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function js() {
  return src('src/*.js', { sourcemaps: true })
    .pipe(uglify())
    .pipe(dest('dist/', { sourcemaps: true }))
    .pipe(browsersync.stream());
}

function watchFiles() {
  watch("./src/*.js", js);
  watch("./index.html", browserSyncReload);
}

exports.js = js;
exports.default = parallel(js);
exports.watch = parallel(watchFiles, browserSync);
