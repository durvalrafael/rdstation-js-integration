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
    aws_s3: {
      options: {
        differential: true,
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        progress: 'dots',
        region: 'sa-east-1'
      },
      beta: {
        options: {
          bucket: '<%= aws.bucket %>'
        },
        files: [
          { action: 'upload',
            expand: true,
            cwd: 'build/',
            src: ['<%= pkg.name %>.min.js'],
            dest: '<%= aws.destination %>/beta/'
          },
        ]
      },
      stable: {
        options: {
          bucket: '<%= aws.bucket %>'
        },
        files: [
          { action: 'upload',
            expand: true,
            cwd: 'build/',
            src: ['**'],
            dest: '<%= aws.destination %>/stable/'
          }
        ]
      },
    },
    jsdoc : {
        dist : {
            src: ['app/*.js', 'test/*.js'], 
            options: {
                destination: 'docs'
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('deploy', ['aws_s3:beta']);
  grunt.registerTask('deploy:beta', ['aws_s3:beta']);
  grunt.registerTask('deploy:stable', ['aws_s3:stable']);
  grunt.registerTask('default', ['jshint', 'karma', 'uglify']);

};
