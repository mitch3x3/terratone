# terratone.io

A auditory map of San Francisco that focuses on the sounds of the city.

## Deploy to AWS (Elastic Beanstalk)

[This](http://terratone.us-east-1.elasticbeanstalk.com/) is an alias to the
actual [terratone.io](http://www.terratone.io).

Deploy:
```
$ eb deploy
```

Open in new window:
```
$ eb open
```

## Deploy to Heroku

After commiting and pushing your git changes:

Deploy:
```
$ git push heroku master
```

View at: [terratone.herokuapp.com](https://terratone.herokuapp.com/)
## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
git clone git@github.com:heroku/node-js-sample.git # or clone your own fork
cd node-js-sample
npm install
npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
heroku create
git push heroku master
heroku open
```
