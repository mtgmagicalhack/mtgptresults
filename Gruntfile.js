module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['build/*'],

    copy: {
      all: {
        files: [
          {
            src: 'src/index.html',
            dest: 'build/index.html'
          },
          {
            src: 'src/ptlogo.png',
            dest: 'build/logo/ptlogo.png'
          }
        ]
      },
      logos: {
        files: [
          {
            expand: true,
            src: 'data/**/*.png',
            dest: 'build/logo/',
            rename: function(dest, src) {
              var parts = src.split('/');
              return dest + parts[1] + '.png';
            }
          }
        ],
      },
      data: {
        files: [
          {
            src: 'data/recent.json',
            dest: 'build/data/recent.js',
          },
          {
            src: 'data/tournaments.json',
            dest: 'build/data/tournaments.js',
          },
          {
            src: 'data/players.json',
            dest: 'build/data/players.js',
          }
        ],
        options: {
          process: function(data, path) {
            path = path.replace('data/', '');
            path = path.replace('.json', '');
            arg = path.charAt(0).toUpperCase() + path.slice(1);
            return 'window.' + arg + ' = ' + data + ';';
          },
        }
      }
    },

    sass: {
      all: {
        options: {
          style: 'compressed'
        },
        files: {
          'build/css/app.css': 'src/css/app.scss'
        }
      }
    },

    jshint: {
      all: ['src/**/*.js', 'src/**/*.jsx'],
      options: {
        browser: true,
        jquery: true,
        node: true,
        strict: true
      }
    },

    browserify: {
      all: {
        files: {
          'build/js/app.js' : ['src/js/*.js', 'src/js/*.jsx']
        }
      },
      options: {
        transform: [ require('grunt-react').browserify ],
        extensions: ['js', 'jsx']
      }
    },

    uglify: {
      all: {
        files: {
          'build/js/app.js' : ['build/js/app.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('js', ['jshint', 'browserify']);
  grunt.registerTask('css', ['sass']);
  grunt.registerTask('default', ['copy', 'css', 'js'])
  grunt.registerTask('prod', ['default', 'uglify'])
}