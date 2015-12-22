module.exports = function ( grunt ) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-plato');


    /**
     * Load in our build configuration file.
     */
    var userConfig = require( './build.config.js' );

    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {
        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.npm
         */
        pkg: grunt.file.readJSON("package.json"),

        /**
         * The banner is the comment that is placed at the top of our compiled
         * source files. It is first processed as a Grunt template, where the `<%=`
         * pairs are evaluated based on this very configuration object.
         */
        meta: {
            banner:
                '/**\n' +
                    ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    ' *\n' +
                    ' * Copyright (c) <%= grunt.template.today("yyyy") %> ICDC\n' +
                    ' */\n'
        },

        /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: {
            report: ['<%= report_dir %>'],
            build: ['<%= build_dir %>'],
            static_dist_dir: ['<%= static_dist_dir %>'],
            release_dir: ['<%= release_dir %>'],
            options: {
                force: true
            }
        },
        compress: {
            dist: {
                options: {
                    archive: '<%= static_dist_dir %>/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                cwd : '<%= release_dir %>',
                src: ['**']
            }
        },

        /**
         * The `copy` task just copies files from A to B. We use it here to copy
         * our project assets (images, fonts, etc.) and javascripts into
         * `build_dir`, and then to copy the assets to `compile_dir`.
         */
        copy: {

            build_app_js: {
                files: [
                    {
                        src: [ '<%= app_files.js %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_jsunit: {
                files: [
                    {
                        src: [ '<%= app_files.jsunit %>' ],
                        dest: '<%= build_dir %>/tests/unit',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            build_mock_json: {
                files: [
                    {
                        src: [ '<%= app_files.mock.json %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            dist: {
                files: [
                    {
                        src: [ '<%= static_dist_dir %>/*.js', '<%= static_dist_dir %>/*.css' ],
                        dest: '<%= release_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            dist_index: {
                files: [
                    {
                        src: [ 'index.min.html' ],
                        dest: '<%= release_dir %>/index.html',
                        cwd: '.'
                    }
                ]
            },
            dist_img: {
                files: [
                    {
                        src: [ '<%= app_files.img %>' ],
                        dest: '<%= release_dir %>/assets',
                        cwd: '.'
                    }
                ]
            }
        },

        /**
         * `grunt concat` concatenates multiple source files into a single file.
         */
        concat: {


            /**
             * The `compile_app_js` target is the concatenation of our application source
             * code and all specified vendor source code into a single file.
             */
            compile_app_js: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: [
                    'module.prefix',
                    '<%= app_files.js %>',
                    'module.suffix'
                ],
                dest: '<%= static_dist_dir %>/<%= pkg.name %>.js'
            },

            build_app_css: {
                src: [
                    '<%= vendor_files.css %>',
                    '<%= app_files.css %>'
                ],
                dest: '<%= static_dist_dir %>/<%= pkg.name %>.css'
            },

            compile_vendor_js: {
                options: {
                },
                src: [
                    '<%= vendor_files.js %>'
                ],
                dest: '<%= static_dist_dir %>/<%= pkg.name %>-vendor.js'
            }

        },



        /**
         * `ng-min` annotates the sources before minifying. That is, it allows us
         * to code without the array syntax.
         */
        ngmin: {
            compile: {
                files: [
                    {
                        src: [ '<%= app_files.js %>' ],
                        cwd: '<%= build_dir %>',
                        dest: '<%= build_dir %>',
                        expand: true
                    }
                ]
            }
        },

        /**
         * Minify the sources!
         */
        uglify: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>',
                    mangle: false
                },
                files: {
                    '<%= static_dist_dir %>/<%= pkg.name %>.min.js': '<%= concat.compile_app_js.dest %>'
                }
            },
            compile_vendor: {
                options: {
                    mangle: false
                },
                files: {
                    '<%= static_dist_dir %>/elink-vendor.min.js': '<%= concat.compile_vendor_js.dest %>'
                }
            }

        },


        /**
         * `jshint` defines the rules of our linter as well as which files we
         * should check. This file, all javascript sources, and all our unit tests
         * are linted based on the policies listed in `options`. But we can also
         * specify exclusionary patterns by prefixing them with an exclamation
         * point (!); this is useful when code comes from a third party but is
         * nonetheless inside `src/`.
         *
         * On joue jshint sur les sources du projet pour faciliter la correction et l'identification du pb
         *
         * http://jshint.com/docs/options/
         */
        jshint: {
            beforeconcat : {
                src: [
                    '<%= app_files.js %>'
                ],
                test: [
                    '<%= app_files.jsunit %>'
                ],
                options: {
                    "asi": true,
                    "bitwise": false,
                    "boss" : true,
                    "browser": true,
                    "camelcase": false,
                    "curly": true,
                    "eqeqeq": true,
                    "eqnull" : true,
                    "esnext": true,
                    "immed": true,
                    "latedef": false,
                    "newcap": true,
                    "noarg": true,
                    "node": true,
                    "regexp": true,
                    "smarttabs": false,
                    "strict": false,
                    "sub" : true,
                    "trailing": true,
                    "undef": true,
                    "unused": true,
                    "white": false,
                    "-W099": true,
                    "-W116": true,
                    "predef": ["angular"]
                }
            },
            afterconcat : {
                src: [
                    '<%= static_dist_dir %>/<%= pkg.name %>.js'
                ],
                options: {
                    "asi": true,
                    "bitwise": false,
                    "boss" : true,
                    "browser": true,
                    "camelcase": false,
                    "curly": true,
                    "eqeqeq": true,
                    "eqnull" : true,
                    "esnext": true,
                    "immed": true,
                    "latedef": false,
                    "newcap": true,
                    "noarg": true,
                    "node": true,
                    "regexp": true,
                    "smarttabs": false,
                    "strict": false,
                    "sub" : true,
                    "trailing": true,
                    "undef": true,
                    "unused": true,
                    "white": false,
                    "-W099": true,
                    "-W116": true,
                    "predef": ["angular"]
                },
                globals: {}
            }
        },

        /**
         * rapport qualimétrie
         */
        plato: {
            report: {
                options : {
                    complexity : {

                    },
                    jshint: {
                        "asi": true,
                        "bitwise": false,
                        "boss" : true,
                        "browser": true,
                        "camelcase": false,
                        "curly": true,
                        "eqeqeq": true,
                        "eqnull" : true,
                        "esnext": true,
                        "immed": true,
                        "latedef": false,
                        "newcap": true,
                        "noarg": true,
                        "node": true,
                        "regexp": true,
                        "smarttabs": false,
                        "strict": false,
                        "sub" : true,
                        "trailing": true,
                        "undef": true,
                        "unused": true,
                        "white": false,
                        "-W099": true,
                        "-W116": true,
                        "predef": ["angular"]
                    }
                },
                files: {
                    '<%= report_dir %>': ['<%= app_files.js %>']
                }
            }
        },


        /**
         * HTML2JS is a Grunt plugin that takes all of your template files and
         * places them into JavaScript files as strings that are added to
         * AngularJS's template cache. This means that the templates too become
         * part of the initial payload as one JavaScript file. Neat!
         */
        html2js: {
            /**
             * These are the templates from `ngviews`.
             */
            app: {
                src: [ '<%= app_files.tpl %>' ],
                dest: '<%= static_dist_dir %>/templates-views.js'
            }

        },

        /**
         * The Karma configurations.
         */
        karma: {
            options: {
                configFile: '<%= build_dir %>/karma-unit.js'
            },
            watch: {
                runnerPort: 9101,
                background: true
            },
            run: {
                singleRun: true
            }
        },

        /**
         * This task compiles the karma template so that changes to its file array
         * don't have to be managed manually.
         */
        karmaconfig: {
            unit: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= test_files.js %>'
                ]
            }
        },

    };

    grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

    grunt.file.setBase('.');

    /**
     * In order to make it safe to just compile or copy *only* what was changed,
     * we need to ensure we are starting from a clean, fresh build. So we rename
     * the `watch` task to `delta` (that's why the configuration var above is
     * `delta`) and then add a new task called `watch` that does a clean build
     * before watching for changes.
     */
    grunt.renameTask( 'watch', 'delta' );
    grunt.registerTask( 'watch', [ 'dev', 'delta' ] );


    /**
     * Tâche par défaut sur la commande 'grunt"
     */
    grunt.registerTask( 'default', [ 'dev' ] );

    /**
     * Tâches usuelles en mode developpement
     * - jshint va aider au debug
     * - lancement des tests unitaires
     * Travail sur les ressources classiques, non concaténé ou minifiée
     */
    grunt.registerTask( 'dev', [
        'jshint:beforeconcat',
        'tests'
    ]);

    /**
     * Rapport qualimetrie
     */
    grunt.registerTask( 'report', [
        'clean:report',
        'plato:report'
    ]);

    /**
     * Tests unitaires
     */
    grunt.registerTask( 'tests', [
        'karmaconfig',
        'karma',
    ]);

    /**
     * concatenation/minification des ressources js et css
     * html2js pour les vues Angular
     * Suite à cette tâche, on peut utiliser le fichier index.min.html
     */
    grunt.registerTask( 'package', [
        'clean:build', 'clean:static_dist_dir',
        'copy:build_app_js',
        'html2js',
        'ngmin',
        'concat',
        'uglify',
    ]);

    /**
     * Zip le contenu du repertoire release-dist et pose le fichier resultat dans le repertoire static-dist
     */
    grunt.registerTask( 'make_bin', [
        'compress:dist'
    ]);

    /**
     * Exporte les fichiers nécessaires à la mise en production
     * On ne prend que les fichiers suite à concatenation/minification et le fichier index.min.html,
     * renommer en index.html dans le répertoire cible.
     * Zip l'ensemble dans le static-dist
     */
    grunt.registerTask( 'dist', [
        'clean:release_dir',
        'package',
        'copy:dist', 'copy:dist_index', 'copy:dist_img',
        'make_bin'
    ]);

    grunt.registerTask( 'release', [
        'dist'
    ]);
   
    /**
     * In order to avoid having to specify manually the files needed for karma to
     * run, we use grunt to manage the list for us. The `karma/*` files are
     * compiled as grunt templates for use by Karma. Yay!
     */
    grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
        var jsFiles = filterForJS( this.filesSrc );

        grunt.file.copy( 'src/test/config/karma-unit.tpl.js', grunt.config( 'build_dir' ) + '/karma-unit.js', {
            process: function ( contents, path ) {
                return grunt.template.process( contents, {
                    data: {
                        scripts: jsFiles
                    }
                });
            }
        });
    });

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS ( files ) {
        return files.filter( function ( file ) {
            return file.match( /\.js$/ );
        });
    }

    /**
     * A utility function to get all app CSS sources.
     */
    function filterForCSS ( files ) {
        return files.filter( function ( file ) {
            return file.match( /\.css$/ );
        });
    }

};
