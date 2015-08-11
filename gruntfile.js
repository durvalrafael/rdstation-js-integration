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
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        region: 'sa-east-1'
      },
      beta: {
        cwd: 'build/',
        src: ['<%= pkg.name %>.min.js'],
        dest: '<%= aws.destination %>/beta/'
      }
      stable: {
        cwd: 'build/',
        src: ['<%= pkg.name %>.min.js'],
        dest: '<%= aws.destination %>/stable/'
      }
    },
    cloudfront: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        distributionId: '<%= aws.distributionId %>',
      },
      html: {
        options: {
          invalidations: [
            '/js/integration'
          ],
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-aws');


  grunt.registerTask('deploy', ['s3:beta']);
  grunt.registerTask('deploy:beta', ['s3:beta']);
  grunt.registerTask('deploy:stable', ['s3:stable']);
  grunt.registerTask('default', ['jshint', 'karma', 'uglify']);

};