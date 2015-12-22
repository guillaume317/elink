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
            './bower_components/angular-animate/angular-animate.js',
            './bower_components/angular-aria/angular-aria.js',
            './bower_components/angular-cookies/angular-cookies.js',
            './bower_components/angular-local-storage/dist/angular-local-storage.js',
            './bower_components/angular-messages/angular-messages.js',
            './bower_components/angular-translate/angular-translate.js',
            './bower_components/messageformat/messageformat.js',
            './bower_components/messageformat/locale/fr.js',
            './bower_components/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.js',
            './bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
            './bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js',
            './bower_components/angular-ui-router/release/angular-ui-router.js',
            './bower_components/firebase/firebase.js',
            './bower_components/angularfire/dist/angularfire.js',
            './bower_components/angular-material/angular-material.js',
            './bower_components/angular-material-icons/angular-material-icons.js'

        ],
        css: [
            './bower_components/bootstrap/dist/css/bootstrap.css'
        ],

        fonts: [
            './bower_components/fontawesome/fonts/*.*'
        ]

    }


};
