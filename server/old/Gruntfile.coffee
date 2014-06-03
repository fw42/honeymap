

module.exports = (grunt) ->
  grunt.initConfig {
    pkg: grunt.file.readJSON('package.json')

    src_common: ['coffee/sockjs.coffee', 'coffee/{config,http,main}.coffee']

    # choose one of:
    #
    # - hpfeeds
    # - random
    # - upd
    src_feed: 'random'

    src: ['coffee/honeymap/<%= src_feed %>.coffee'].concat('<%= src_common %>')

    coffee: {
      compile: {
        options: { join: true }
        files: {
          'js/honeymap.js': ['<%= src %>']
        }
      }
    }
    watch: {
      files: ['<%= src %>']
      tasks: ['coffee']
    }
  }

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['coffee']
