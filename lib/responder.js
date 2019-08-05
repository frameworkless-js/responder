const serveStaticResponder = require('./serve-static')
const serveRouteResponder = require('./serve-route')
const errors = require('../config/errors')

const responder = context => {
  const serveStatic = serveStaticResponder(context.static)
  const serveRoute = serveRouteResponder(context.routes)

  return async (request, response) => {
    const urlTokens = request.url.split('.')
    const extension = urlTokens.length > 1 ? urlTokens[urlTokens.length - 1].toLowerCase().trim() : false
    const serveResponse = extension ? serveStatic : serveRoute
    const responseParams = { path: request.url }

    if (extension) {
      responseParams.extension = extension
    } else {
      responseParams.request = request
      responseParams.context = {
      }
    }

    try {
      return await serveResponse(responseParams, response)
    } catch (error) {
      const errorData = errors[error.message]
      response.writeHead(errorData.code, { 'Content-Type': 'text/html' })

      if (context.handleError) return context.handleError(errorData)
      else return response.end(context.errorPage)
    }
  }
}

module.exports = responder
