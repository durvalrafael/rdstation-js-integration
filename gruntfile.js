module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('.aws_credentials.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'app/<%= pkg.name %>.js',
        dest: 'app/<%= pkg.name %>.min.js'
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
      production: {
        options: {
          bucket: 'rdstation-static'
        },
        files: [
          { action: 'upload',
            expand: true,
            cwd: 'app/',
            src: ['<%= pkg.name %>.min.js'],
            dest: 'js/integration/<%= pkg.version %>/'
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

  grunt.registerTask('deploy', ['aws_s3']);
  grunt.registerTask('default', ['jshint', 'karma', 'uglify', 'jsdoc']);

};