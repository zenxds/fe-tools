'use strict'

const gulp = require('gulp')

let filesToCopy = [
    'src/filter/*.js',
    'src/lib/**/*.js'
]
let dest = 'dist/'

gulp.task('copy', function() {
    gulp.src(filesToCopy, {
        base: 'src'
    })
    .pipe(gulp.dest(dest))
})