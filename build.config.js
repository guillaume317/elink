/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {


    build_dir: 'build',

    src_dir: 'src',

    static_dist_dir: 'dist',

    release_dir: '../elink-dist',

    report_dir: 'reports',

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */

    app_files: {
        css : ['src/css/**/*.css'],
        img : ['src/img/**/*'],
        js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/**/*.tpl.js' ], // source js du projet, sans les tests
        jsunit: ['src/**/*.spec.js'],
        mock: {
            json: [ 'src/test/mock/**/*.json']
        },
        tpl: ['src/**/*.tpl.html'] // templates des vues
    },


    test_files: {
        js: [
            './bower_components/angular-mocks/angular-mocks.js'
        ]
    },

    // declaration des fichiers js et css des librairies à importer dans la page principale
    vendor_files: {
        js: [
            './bower_components/angular/angular.js',
            './bower_components/angular-aria/angular-aria.js',
            './bower_components/angular-ui-router/release/angular-ui-router.js',
            './bower_components/angular-bootstrap/ui-bootstrap.min.js',
            './bower_components/ng-browser-info/dist/ngBrowserInfo.js',
            './bower_components/ngstorage/ngStorage.js',
            './bower_components/angular-fwk-dei/angular-fwk-dei.js'
        ],
        css: [
            './bower_components/bootstrap/dist/css/bootstrap.css'
        ],

        fonts: [
            './bower_components/fontawesome/fonts/*.*'
        ]

    }


};
