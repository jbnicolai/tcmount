'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    githooks: {
      all: {
        'pre-commit': 'jshint'
      }
    },
    clean: {
      githooks: {
        src: ['.git/hooks/pre-commit']
      }
    },
    jshint: {
      src: {
        src: ['src/**/*.*'],
        options: {
          node: true,
          unused: 'vars',
          globalstrict: true,
          // eqeqeq: true,
          forin: true,
          latedef: true,
          quotmark: 'single',
          undef: true,
          trailing: true,
          lastsemic: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-githooks');

  grunt.registerTask('hook', ['githooks']);
  grunt.registerTask('unhook', ['clean:githooks']);
  grunt.registerTask('default', ['jshint']);
};
