"use strict";

var gulp = require("gulp"),
    purescript = require("gulp-purescript"),
    jsValidate = require("gulp-jsvalidate"),
    rimraf = require("rimraf"),
    webpack = require("webpack-stream");

var sources = [
    "src/**/*.purs",
    "bower_components/purescript-*/src/**/*.purs"
];

var foreigns = [
    "src/**/*.js",
    "bower_components/purescript-*/src/**/*.js"
];

var exampleSources = [
    "example/src/**/*.purs"
];

var exampleForeigns = [
    "example/src/**/*.js"
];


gulp.task("clean", function (cb) {
  rimraf("output", cb);
});

gulp.task("make", function() {
    return purescript.psc({
        src: sources,
        ffi: foreigns
    });
});

gulp.task("example-make", function() {
    return purescript.psc({
        src: sources.concat(exampleSources),
        ffi: foreigns.concat(exampleForeigns)
    });
});

gulp.task('example-bundle', ['example-make'], function() {
    return purescript.pscBundle({
        src: "output/**/*.js",
        main: "Main",
        output: "bundled.js"
    });
});

gulp.task("example", ["example-bundle"], function() {
    return gulp.src("bundled.js")
        .pipe(webpack({
            resolve: {
                modulesDirectories: [
                    "node_modules"
                ]
            },
            output: {
                filename: "example.js"
            }
        }))
        .pipe(gulp.dest("example"));
});


gulp.task("jsvalidate", ["make"], function() {
    return gulp.src("output/**/*.js")
        .pipe(jsValidate());
});

gulp.task("default", ["jsvalidate", "example"]);
