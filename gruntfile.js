module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('.aws_config.json'),
    uglify: {
      options: {
        banner: '/*! Resultados Digitais - <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'app/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      files: ['gruntfile.js', 'app/<%= pkg.name %>.js', 'test/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    },
    jsdoc : {
      dist : {
        src: ['app/*.js', 'test/*.js'],
        options: {
          destination: 'docs'
        }
      }
    },
    s3: {
      options: {
        accessKeyId: "<%= aws.accessKeyId %>",
        secretAccessKey: "<%= aws.secretAccessKey %>",
        bucket: '<%= aws.bucket %>',
        access: 'public-read'
      },
      beta: {
        cwd: 'build/',
        src: ['<%= pkg.name %>.min.js'],
        dest: '<%= aws.destination %>/beta/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-aws');


  var env = grunt.option('env') || 'beta';
  grunt.registerTask('deploy', ['s3:beta']);
  grunt.registerTask('invalidate-cache', ['aws_cloudfront:' + env]);
  grunt.registerTask('default', ['jshint', 'karma', 'uglify']);

};