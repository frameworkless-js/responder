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

  // If you want static files
  static: {
    directory: 'public'
  },

  // If you want dynamic routes
  routes: {
    directory: 'routes',

    // And if you want templated routes
    templates: {
      directory: 'templates'
    }
  }
}

const server = createServer(responder(responderOptions))

server.listen(1234)
```

## Form data

Your routes need form data parsing if you're going to accept user-submitted content!

## Tests

```
npm run test
```

## Contributing

I would love your help! Please [make an issue](https://github.com/frameworkless-js/bodyparser/issues) or better yet [create a pull request](https://github.com/frameworkless-js/bodyparser/pulls) if you find a bug or missing feature!
