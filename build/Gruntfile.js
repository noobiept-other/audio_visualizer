module.exports = function( grunt )
{
var root = '../';
var dest = '../release/<%= pkg.name %>_<%= pkg.version %>/';

grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

            // remove the destination folder first
        clean: {
            options: {
                force: true
            },

            release: [
                dest
            ]
        },

            // copy the necessary files
        copy: {
            release: {
                expand: true,
                cwd: root,
                src: [
                    'libraries/**'
                ],
                dest: dest
            }
        },

            // minimize the javascript
        uglify: {
            release: {
                files: [{
                    src: root + 'scripts/**/*.js',
                    dest: dest + 'min.js'
                }]
            }
        },

            // minimize the css
        cssmin: {
            release: {
                files: [{
                    expand: true,
                    cwd: root + 'css/',
                    src: '**/*.css',
                    dest: dest + 'css/'
                }]
            }
        },

            // update the html file to load the min.js file
        processhtml: {
            release: {
                expand: true,
                cwd: root,
                src: 'index.html',
                dest: dest
            }
        }
    });

    // load the plugins
grunt.loadNpmTasks( 'grunt-contrib-clean' );
grunt.loadNpmTasks( 'grunt-contrib-copy' );
grunt.loadNpmTasks( 'grunt-contrib-uglify' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
grunt.loadNpmTasks( 'grunt-processhtml' );

    // tasks
grunt.registerTask( 'default', [ 'clean', 'copy', 'uglify', 'cssmin', 'processhtml' ] );
};