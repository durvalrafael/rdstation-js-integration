# RD Station JS Integration

[![Code Climate](https://codeclimate.com/repos/55422dbfe30ba03b8901455c/badges/63c81bce6e34fbb49fc7/gpa.svg)](https://codeclimate.com/repos/55422dbfe30ba03b8901455c/feed)

This is a project to integrate any form with RD Station. Mainly, it posts information filled in the form to RD Station API, creating a new Lead Conversion.

It uses Grunt JS Task Runner, Karma Test Runner, Jasmine Framework, Circle CI for continuos integrations and Amazon Cloudfront for the CDN.

### Install
In order to prepare your machine to make changes on RD Station JS Integration you must run:
+ `npm install`

Now all the Grunt plugins have been installed and you can start to play with them.

### Grunt JS

Grunt is a JavaScript task runner which here is used to:
+ Lint,
+ Minify,
+ Test,
+ Deploy.

If you want to create a new automated task you may check where the whole magic happens: `/gruntfile.js`. See [Grunt documentation and it's plugins](http://gruntjs.com/) for developing.

### CircleCI

RD Station Integration uses Circle CI! Everytime you push anything to Github, CircleCI will run the tasks defined in `/circle.yml`.

### Amazon Cloudfront deploy

Gruntfile has a task `deploy` for deploying any `app/*.min.js` file into Amazon Cloudfront. In case you need to upload any other file to Amazon, you should add it to the `grunt deploy` task.

When deploying, you have to set the environment you intend to deploy. Follow this:

```
grunt deploy--env=beta
```

```
grunt deploy --env=stable
```

You may have noticed that the script wasn’t deployed after it has passed the tests. We made this choice due to secutiry reasons: The `grunt deploy` task needs the Amazon credentials. Since the repository is public, it's not safe to reveal company credentials in it. To avoid test errors, you will find at project files a `.json` with generic credentials for amazon: `/.aws_credentials.json`.

To make deploy task works, fill `.aws_credentials` with your Amazon S3 credentials.

## Versioning

Any changes must generate a new version of the script. This project uses [semantic versioning](http://semver.org/).
MAJOR and MINOR versions changes must be notificated in RD Station blog. PATCH version changing doesn't.
