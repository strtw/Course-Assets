module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('postcss');
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'), //pulls in the data from package.json and stores it in the pkg property.
        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, src: ['html/*.html'], dest: 'dest/', filter: 'isFile'}
                ],
            },
        },
        postcss: {
            options: {
                map: true, // inline sourcemaps
                processors: [
                    // require('pixrem')(), // add fallbacks for rem units
                    require('autoprefixer')({
                        browsers: 'last 2 versions'
                    }), // add vendor prefixes
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                files: [{
                    src: 'styles/*.css',
                    dest: 'postcss/',
                    expand: true
                }]
            }
        },
        cssmin: {
            all: {
                files: {
                    'dest/app.min.css': ['postcss/styles/*.css']
                }
            }
        },
        uglify: {
            all: {
                files: {
                    'dest/app.js': ['js/*.js']
                }
            }
        },
        htmllint: {
            all: ['html/*.html'],
            options: {
                force: true
            }
        },
        csslint: {
            all: {
                src: ['styles/*.css']
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'js/*.js'],
            options: {
                asi: true, // Don't worry about missing semicolons
                undef: true, // Warn about undeclared globals
                globals: { // Pass in a list of globals we don't want warnings about
                    module: true,
                    require: true,
                    console: true
                },
                force: true
            },
            dev: {
                force: true
            }
        },
        sass: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'sass',
                    src: ['*.scss'],
                    dest: 'styles',
                    ext: '.css'
                }]
            }
        },
        watch: {
            scripts: {
                files: ['js/*.js'],
                tasks: ['jshint:dev'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['sass/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true
                }
            }
        },
        jasmine: {
            all: {
                src: ['js/*.js'],
                options: {
                    specs: ['spec/**/*Spec.js']
                }
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    src: ['img/*.{png,jpg,gif}'],
                    dest: 'dest/'
                }]
            }
        },
        version: {
            src: ['package.json', 'index.html'],
            options: {
                prefix: '[\\?]?version[\\\'"]?[=:]\\s*[\\\'"]?'
            }
        },
        exec: {
            add: 'git add .', // Add all changed files to the commit
            commit: {
                cmd: function() {
                    var oldPkg = this.config('pkg') // Get the pkg property from our config
                        ,
                        pkg = grunt.file.readJSON('package.json'),
                        cmd = 'git commit -am "Updating from ' + oldPkg.version + ' to ' + pkg.version + '"';
                    return cmd;
                }
            },
            push: 'git push' // Send our changes to the repository
        }
    });
    grunt.registerTask('minify', function(full) {
        if (full) {
            grunt.task.run(['cssmin', 'uglify', 'imagemin']);
        } else {
            grunt.task.run(['cssmin', 'uglify']);
        }
    });

    ////CSS TASKS////
    grunt.registerTask('css', ['sass', 'csslint', 'postcss', 'cssmin']);

    //HTML TASKS//
    grunt.registerTask('html', ['htmllint','copy']);

    //JS TASKS//

    grunt.registerTask('js', ['uglify','jshint','jasmine']);

    ///IMAGES///

    grunt.registerTask('img', ['imagemin']);


    ////BUILD////

    grunt.registerTask('build', function(){
        grunt.task.run(['html','js','css','img'])
    });

    ///DEPLOYMENT//
    grunt.registerTask('deploy', function(releaseType) {
        if (!releaseType) {
            releaseType = 'patch';
        }
        grunt.task.run(['build','version::' + releaseType, 'exec:add', 'exec:commit', 'exec:push']);
    });
    // grunt.registerTask('minify', ['cssmin', 'uglify']); Registers a new
    // multiple task runner from existing tasksgrunt
    // Default task(s).
    grunt.registerTask('default', function() {
        console.log('Grunt has run');
    });
};