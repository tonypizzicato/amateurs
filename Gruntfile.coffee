# Generated on 2014-10-29 using generator-webapp-rjs 0.4.8
"use strict"

# # Globbing
# for performance reasons we're only matching one level down:
# 'test/spec/{,*/}*.js'
# use this if you want to recursively match all subfolders:
# 'test/spec/**/*.js'
module.exports = (grunt) ->

    # Load grunt tasks automatically
    require("load-grunt-tasks") grunt

    # Define the configuration for all the tasks
    grunt.initConfig

    # Project settings
        yeoman:
        # Configurable paths
            public: "public"
            dist:   "dist"
            server: "."


    # Watches files for changes and runs tasks based on the changed files
        watch:
            options:
                livereload: 35731

            coffee:
                files: ["<%= yeoman.public %>/scripts/**/*.{coffee,litcoffee,coffee.md}"]
                tasks: ["coffeeify"]

            gruntfile:
                files: ["Gruntfile.js"]

            compass:
                files: ["<%= yeoman.public %>/styles/**/*.{scss,sass}"]
                tasks: [
                    "compass:server"
                    "autoprefixer"
                ]

            styles:
                files: ["<%= yeoman.public %>/styles/**/*.css"]
                tasks: [
                    "newer:copy:styles"
                    "autoprefixer"
                ]

            express:
                files: [#Files to be watched
                    "<%= yeoman.server %>/server.js"
                    "<%= yeoman.server %>/config/*.js"
                    "<%= yeoman.server %>/app/*.js"
                    "<%= yeoman.server %>/controllers/*.js"
                    "<%= yeoman.server %>/controllers/api/*.js"
                    "<%= yeoman.server %>/models/*.js"
                    "<%= yeoman.server %>/views/**/*.hbs"
                ]
                tasks: ["express:dev"] #(Re)start the server
                options: #Server options
                    spawn: false #Must have for reload
                    livereload: true #Enable LiveReload


    # Empties folders to start fresh
        clean:
            dist:
                files: [
                    dot: true
                    src: [
                        ".tmp"
                        "<%= yeoman.dist %>/*"
                        "!<%= yeoman.dist %>/.git*"
                    ]
                ]
            server: ".tmp"

    # Compiles Sass to CSS and generates necessary files if requested
        compass:
            options:
                sassDir:                 "<%= yeoman.public %>/styles"
                cssDir:                  ".tmp/styles"
                generatedImagesDir:      ".tmp/images/generated"
                imagesDir:               "<%= yeoman.public %>/images"
                javascriptsDir:          "<%= yeoman.public %>/scripts"
                fontsDir:                "<%= yeoman.public %>/styles/fonts"
                importPath:              "node_modules"
                httpImagesPath:          "/images"
                httpGeneratedImagesPath: "/images/generated"
                httpFontsPath:           "/styles/fonts"
                relativeAssets:          false
                assetCacheBuster:        false

            dist:
                options:
                    generatedImagesDir: "<%= yeoman.dist %>/images/generated"

            server:
                options:
                    debugInfo: false


    # Add vendor prefixed styles
        autoprefixer:
            options:
                browsers: ["last 1 version"]

            dist:
                files: [
                    expand: true
                    cwd:    ".tmp/styles/"
                    src:    "**/*.css"
                    dest:   ".tmp/styles/"
                ]

        coffeeify:
            dist:
                files: [{
                    src: ["<%= yeoman.public %>/scripts/app.coffee"]
                    dest: ".tmp/scripts/out.js"
                }]
                options:
                    debug: true


    #uglify2: {} // https://github.com/mishoo/UglifyJS2
        cssmin:
            target:
                files: [{
                    expand: true
                    cwd: '<%= yeoman.tmp %>/styles'
                    src: ['*.css', '!*.min.css']
                    dest: '<%= yeoman.dist %>/styles'
                    ext: '.min.css'
                }]


    # Renames files for browser caching purposes
        rev:
            dist:
                files:
                    src: [
                        "<%= yeoman.dist %>/scripts/{,*/}*.js"
                        "<%= yeoman.dist %>/styles/**/*.css"
                        "<%= yeoman.dist %>/images/**/*.{gif,jpeg,jpg,png}"
                        "!<%= yeoman.dist %>/images/logos/*.{gif,jpeg,jpg,png}"
                        "<%= yeoman.dist %>/styles/fonts/{,*/}*.*"
                        "!<%= yeoman.dist %>/styles/fonts/football/*.{woff,eot,svg,ttf}"
                    ]


    # Reads HTML for usemin blocks to enable smart builds that automatically
    # concat, minify and revision files. Creates configurations in memory so
    # additional tasks can operate on them
        useminPrepare:
            options:
                dest: "<%= yeoman.dist %>"

            html: [
                "<%= yeoman.public %>/promo/nationals.html"
                "<%= yeoman.server %>/views/layout.hbs"
            ]


    # Performs rewrites based on rev and the useminPrepare configuration
        usemin:
            options:
                assetsDirs: ["<%= yeoman.dist %>"]

            html: ["<%= yeoman.dist %>/{,*/}*.{html,hbs}"]
            css:  ["<%= yeoman.dist %>/styles/**/*.css"]


    # The following *-min tasks produce minified files in the dist folder
        imagemin:
            dist:
                files: [
                    expand: true
                    cwd:    "<%= yeoman.public %>/images"
                    src:    "{,*/}{,*/}*.{gif,jpeg,jpg,png}"
                    dest:   "<%= yeoman.dist %>/images"
                ]

        svgmin:
            dist:
                files: [
                    expand: true
                    cwd:    "<%= yeoman.public %>/images"
                    src:    "{,*/}*.svg"
                    dest:   "<%= yeoman.dist %>/images"
                ]

        htmlmin:
            dist:
                options:
                    minifyJS:                  true
                    collapseBooleanAttributes: true
                    collapseWhitespace:        true

                    removeCommentsFromCDATA:   true
                    removeEmptyAttributes:     true
                    removeOptionalTags:        true
                    removeRedundantAttributes: true
                    useShortDoctype:           true
                    customAttrSurround:        [[/\{\{#[^}]+\}\}/, /\{\{\/[^}]+\}\}/]]

                files: [
                    expand: true
                    cwd:    "<%= yeoman.dist %>"
                    src:    ["**/*.{html,hbs}"]
                    dest:   "<%= yeoman.dist %>"
                ]


    # Copies remaining files to places other tasks can use
        copy:
            dist:
                files: [# client app files
                    {
                        expand: true
                        dot:    true
                        cwd:    "<%= yeoman.public %>"
                        dest:   "<%= yeoman.dist %>"
                        src:    [
                            "*.{ico,png,txt}"
                            ".htaccess"
                            "images/{,*/}*.webp"
                            "images/logos/*.png"
                            "{,*/}*.html"
                        ]
                    }
                    {
                        expand: true
                        dot:    true
                        flatten: true
                        cwd:    "<%= yeoman.public %>"
                        dest:   "<%= yeoman.dist %>/styles"
                        src:    [
                            "styles/fonts/football/*.{woff,eot,svg,ttf}"
                        ]
                    }
                    {
                    # server app files
                        expand: true
                        dot:    true
                        cwd:    "<%= yeoman.public %>"
                        dest:   "<%= yeoman.dist %>"
                        src:    [
                            "vendor/bootstrap-sass/vendor/assets/fonts/bootstrap/*.*"
                            "vendor/fontawesome/fonts/*.*"
                            "node_modules/photoswipe/dist/default-skin/*.{png,svg,gif}"
                        ]
                    }
                    {
                    # server app files
                        expand: true
                        flatten: true
                        dot:    true
                        cwd:    "<%= yeoman.public %>"
                        dest:   "<%= yeoman.dist %>/styles"
                        src:    [
                            "node_modules/photoswipe/dist/default-skin/*.{png,svg,gif}"
                        ]
                    }
                    {
                    # server app files
                        expand: true
                        dot:    true
                        cwd:    "<%= yeoman.server %>"
                        dest:   "<%= yeoman.dist %>"
                        src:    ["views/**/*.hbs"]
                    }
                ]

            bodge:
                files: [
                    expand: true
                    dot:    true
                    cwd:    "<%= yeoman.public %>"
                    dest:   ".tmp"
                    src:    ["**/*.js"]
                ]

            styles:
                expand: true
                dot:    true
                cwd:    "<%= yeoman.public %>/styles"
                dest:   ".tmp/styles/"
                src:    "{,*/}*.css"

    # express app
        express:
            options:
            # Override defaults here
                port:       "9000"
                livereload: true

            dev:
                options:
                    script: "<%= yeoman.server %>/server/boot.js"

            prod:
                options:
                    port:   "8081"
                    env:    "production"
                    script: "<%= yeoman.server %>/server/boot.js"

            test:
                options:
                    script: "<%= yeoman.server %>/server/boot.js"


    # Run some tasks in parallel to speed up build process
        concurrent:
            server: [
                "compass:server"
                "coffeeify:dist"
                "copy:styles"
            ]
            test: [
                "coffeeify"
                "copy:styles"
            ]
            dist: [
                "coffeeify"
                "compass"
                "copy:bodge"
                "copy:styles"
            ]

    # starts express server with live testing via testserver
    grunt.registerTask "server", [
        "clean:server"
        "concurrent:server"
        "autoprefixer"
        "express:dev"
        "watch"
    ]

    grunt.registerTask "build", [
        "clean:dist"
        "copy:bodge"
        "concurrent:dist"
        "useminPrepare"
        "autoprefixer"
        "concat"
        "coffeeify"
        "cssmin"
        "uglify"
        "copy:dist"
        "imagemin"
        "svgmin"
        "rev"
        "usemin"
        "htmlmin"
    ]
    grunt.registerTask "default", ["server"]
