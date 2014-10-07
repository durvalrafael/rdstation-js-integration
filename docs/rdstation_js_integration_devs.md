In order to prepare your machine to make changes on RD Station JS Integration you must clone it's repository and run:
+ `npm install`

Now all the Grunt plugins have been installed and you can start to play with them.

### Grunt JS

Grunt is a JavaScript task runner which here is used to:
+ Lint,
+ Minify,
+ Test,
+ Deploy.

If you intend to use create a new automate task you may check where the whole magic happens: `./gruntfile.js`. See [Grunt documentation and it's plugins](http://gruntjs.com/) for developing.


### CircleCI

RD Station JS Integration uses continuous integration from Circle CI. Everytime you push anything to Github, CircleCI will run the tasks defined in ./circle.yml

### Amazon Cloudfront deploy

The minified script is in Amazon CloudFront. Gruntfile has a task for deploying.
You may notice that the script is not being deployed after it passes in the tests. We made this choice due to secutiry reasons. In Github you find a file with generic credentials for amazon `./.aws_credentials.json`. 

For deploy task works, aws_credentials must have real Amazon S3 credentials, which won't be revealed.
