# `@frameworkless/responder`

A responder function you can pass into a `http.createServer` to work with your frameworkless Node.js HTTP app. Supports serving static files and routes!

This module comes from the output of the [Frameworkless.js](https://frameworkless.js.org) online course.

## Installing

Not ready yet! But will be...

```
npm i --save @frameworkless/responder
```

## Quick Start

Here's the quick, simple usage with the Node's built in HTTP server:

```js
const { createServer } = require('http')
const { responder } = require('@frameworkless/bodyparser')

const responderOptions = {
  // Tell the responder where to look for static assets like images
  staticDirectory: './public',

  // Tell the responder where to look for route definition files
  routeDirectory: './routes',

  // Tell the responder where to look for template files used in routes
  templateDirectory: './templates'
}

const server = createServer(responder(responderOptions))

server.listen(1234)
```

## The Routes object

## Templating routes

## Tests

```
npm run test
```

## Contributing

I would love your help! Please [make an issue](https://github.com/frameworkless-js/bodyparser/issues) or better yet [create a pull request](https://github.com/frameworkless-js/bodyparser/pulls) if you find a bug or missing feature!
