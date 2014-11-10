// Generated on 2014-10-29 using generator-webapp-rjs 0.4.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman:       {
            // Configurable paths
            app:    'app',
            dist:   'dist',
            server: 'server'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch:        {
            options:    {
                livereload: true
            },
            coffee:     {
                files: ['<%= yeoman.app %>/scripts/**/*.{coffee,litcoffee,coffee.md}'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/**/*.{coffee,litcoffee,coffee.md}'],
                tasks: ['coffee:test', 'test:watch']
            },
            gruntfile:  {
                files: ['Gruntfile.js']
            },
            compass:    {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            styles:     {
                files: ['<%= yeoman.app %>/styles/**/*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            livereload: {
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '.tmp/styles/**/*.css',
                    '.tmp/scripts/**/*.js',
                    '<%= yeoman.app %>/images/**/*'
                ]
            },
            express:    {
                files:   ['<%= yeoman.server %>/**/*.js'],   //Files to be watched
                tasks:   ['express:dev'],   //(Re)start the server
                options: {            //Server options
                    spawn:      false,       //Must have for reload
                    livereload: true  //Enable LiveReload
                }
            }
        },

        // The actual grunt server settings
        connect:      {
            options:    {
                port:       8080,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname:   'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            test:       {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist:       {
                options: {
                    open:       true,
                    base:       '<%= yeoman.dist %>',
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh
        clean:        {
            dist:   {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint:       {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all:     [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },


        // Mocha testing framework configuration options
        mocha:        {
            all: {
                options: {
                    run:  true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },


        // Compiles CoffeeScript to JavaScript
        coffee:       {
            dist: {
                files: [{
                    expand: true,
                    cwd:    '<%= yeoman.app %>/scripts',
                    src:    '**/*.{coffee,litcoffee,coffee.md}',
                    dest:   '.tmp/scripts',
                    ext:    '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd:    'test/spec',
                    src:    '**/*.{coffee,litcoffee,coffee.md}',
                    dest:   '.tmp/spec',
                    ext:    '.js'
                }]
            }
        },


        // Compiles Sass to CSS and generates necessary files if requested
        compass:      {
            options: {
                sassDir:                 '<%= yeoman.app %>/styles',
                cssDir:                  '.tmp/styles',
                generatedImagesDir:      '.tmp/images/generated',
                imagesDir:               '<%= yeoman.app %>/images',
                javascriptsDir:          '<%= yeoman.app %>/scripts',
                fontsDir:                '<%= yeoman.app %>/styles/fonts',
                importPath:              '<%= yeoman.app %>/vendor',
                httpImagesPath:          '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath:           '/styles/fonts',
                relativeAssets:          false,
                assetCacheBuster:        false
            },
            dist:    {
                options: {
                    generatedImagesDir: '<%= yeoman.dist %>/images/generated'
                }
            },
            server:  {
                options: {
                    debugInfo: false
                }
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist:    {
                files: [{
                    expand: true,
                    cwd:    '.tmp/styles/',
                    src:    '<%= yeoman.app %>/styles/**/*.css',
                    dest:   '.tmp/styles/'
                }]
            }
        },

        requirejs:     {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    baseUrl:                 '.tmp/scripts',
                    optimize:                'none',
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict:               true,
                    wrap:                    true,
                    findNestedDependencies:  true
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },


        // Renames files for browser caching purposes
        rev:           {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/**/*.css',
                        '<%= yeoman.dist %>/images/**/*.{gif,jpeg,jpg,png}',
                        '<%= yeoman.dist %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html:    ['<%= yeoman.app %>/index.html', '<%= yeoman.app %>/promo/nationals.html']
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin:        {
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            },
            html:    ['<%= yeoman.dist %>/{,*/}*.html'],
            css:     ['<%= yeoman.dist %>/styles/**/*.css']
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin:      {
            dist: {
                files: [{
                    expand: true,
                    cwd:    '<%= yeoman.app %>/images',
                    src:    '{,*/}{,*/}*.{gif,jpeg,jpg,png}',
                    dest:   '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin:        {
            dist: {
                files: [{
                    expand: true,
                    cwd:    '<%= yeoman.app %>/images',
                    src:    '{,*/}*.svg',
                    dest:   '<%= yeoman.dist %>/images'
                }]
            }
        },
        htmlmin:       {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace:        true,
                    removeAttributeQuotes:     true,
                    removeCommentsFromCDATA:   true,
                    removeEmptyAttributes:     true,
                    removeOptionalTags:        true,
                    removeRedundantAttributes: true,
                    useShortDoctype:           true
                },
                files:   [{
                    expand: true,
                    cwd:    '<%= yeoman.dist %>',
                    src:    '{,*/}*.html',
                    dest:   '<%= yeoman.dist %>'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy:          {
            dist:   {
                files: [{
                    expand: true,
                    dot:    true,
                    cwd:    '<%= yeoman.app %>',
                    dest:   '<%= yeoman.dist %>',
                    src:    [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.webp',
                        '{,*/}*.html',
                        'styles/fonts/{,*/}*.*',
                        'vendor/bootstrap-sass/vendor/assets/fonts/bootstrap/*.*',
                        'vendor/fontawesome/fonts/*.*'
                    ]
                }]
            },
            bodge:  {
                files: [{
                    expand: true,
                    dot:    true,
                    cwd:    '<%= yeoman.app %>',
                    dest:   '.tmp',
                    src:    [
                        '**/*.js'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot:    true,
                cwd:    '<%= yeoman.app %>/styles',
                dest:   '.tmp/styles/',
                src:    '{,*/}*.css'
            }
        },


        // Generates a custom Modernizr build that includes only the tests you
        // reference in your app
        modernizr:     {
            devFile:    '<%= yeoman.app %>/vendor/modernizr/modernizr.js',
            outputFile: '<%= yeoman.dist %>/scripts/vendor/modernizr.js',
            files:      [
                '<%= yeoman.dist %>/scripts/{,*/}*.js',
                '<%= yeoman.dist %>/styles/{,*/}*.css',
                '!<%= yeoman.dist %>/scripts/vendor/*'
            ],
            uglify:     true
        },


        // express app
        express:       {
            options: {
                // Override defaults here
                port:       '9000',
                livereload: true
            },
            dev:     {
                options: {
                    script: 'server/app.js'
                }
            },
            prod:    {
                options: {
                    port:   '8081',
                    env:    'production',
                    script: 'server/app.js'
                }
            },
            test:    {
                options: {
                    script: 'server/app.js'
                }
            }
        },

        // mocha command
        exec:          {
            mocha: {
                command: 'mocha-phantomjs http://localhost:<%= connect.test.options.port %>/index.html',
                stdout:  true
            }
        },

        // open app and test page
        open:          {
            server: {
                path: 'http://localhost:<%= express.options.port %>'
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent:    {
            server: [
                'compass:server',
                'coffee:dist',
                'copy:styles'
            ],
            test:   [
                'coffee',
                'copy:styles'
            ],
            dist:   [
                'coffee',
                'compass',
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        }
    });


    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    // starts express server with live testing via testserver
    grunt.registerTask('server', function (target) {

        // what is this??
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.option('force', true);

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'express:dev',
            'open',
            'watch'
        ]);
    });

    //grunt.registerTask('server', function (target) {
    //    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    //    grunt.task.run([target ? ('serve:' + target) : 'serve']);
    //});

    grunt.registerTask('test', function (target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:server',
                'concurrent:test',
                'autoprefixer'
            ]);
        }

        grunt.task.run([
            'connect:test',
            'mocha'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:bodge',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'requirejs',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'modernizr',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'bower',
        'test',
        'build'
    ]);
};
