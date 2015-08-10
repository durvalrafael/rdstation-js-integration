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
      production: {
        options: {
          bucket: '<%= aws.bucket %>'
        },
        files: [
          { action: 'upload',
            expand: true,
            cwd: 'build/',
            src: ['<%= pkg.name %>.min.js'],
            dest: '<%= aws.destination %>/<%= pkg.version %>/'
          },
          { action: 'upload',
            expand: true,
            cwd: 'build/',
            src: ['**'],
            dest: '<%= aws.destination %>/latest/'
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
    aws_cloudfront: {
      invalidate_cloudfront: {
        options: {
          key: '<%= aws.AWSAccessKeyId %>',
          secret: '<%= aws.AWSSecretKey %>',
          distribution: 'E26I7QL64NWP26' //BUCKET rdstation-static
        },
        beta: {
          files: [{
            expand: true,
            cwd: './js/integration/beta',
            //src: ['**/*'], WHAT GOES HERE?
            filter: 'isFile',
            dest: './js/integration/beta' // IS IT RIGHT?
          }]
        },
        stable: {
          files: [{
            expand: true,
            cwd: './js/integration/stable',
            // src: ['**/*'], WHAT GOES HERE?
            filter: 'isFile',
            dest: './js/integration/stable' // IS IT RIGHT?
          }]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-invalidate-cloudfront');
  grunt.loadNpmTasks('grunt-jsdoc');


  var env = grunt.option('env') || 'beta';
  grunt.registerTask('deploy', ['aws_s3']);
  grunt.registerTask('invalidate-cache', ['aws_cloudfront:' + env]);
  grunt.registerTask('default', ['jshint', 'karma', 'uglify']);

};