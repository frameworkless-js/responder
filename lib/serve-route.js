const { readFileSync } = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const serveRoute = ({ base, routes = {} } = {}) => {
  let baseTemplate

  if (base) {
    const basePath = path.relative(path.resolve('./'), base)
    baseTemplate = readFileSync(basePath, 'utf8')
  }

  return async ({ request }, response) => {
    const key = `${request.method || 'GET'}:${request.url}`
    const route = routes[key]

    if (!route) throw new Error('not_found')

    let hbs, routeContext

    if (route.onRequest) {
      const onRequest = await route.onRequest({ context: routeContext })
      if (onRequest) routeContext = { ...routeContext, ...onRequest }
    }

    if (!baseTemplate && route.body) {
      hbs = Handlebars.compile(route.body)
    } else if (baseTemplate && route.body) {
      Handlebars.registerPartial('content', route.body)
      hbs = Handlebars.compile(baseTemplate)
    }

    if (route.data) routeContext = await route.data({ request })

    response.writeHead(200, {
      'Content-Type': route.contentType || 'text/html'
    })

    if (route.beforeRender) {
      const beforeRender = await route.beforeRender({ context: routeContext })
      if (beforeRender) routeContext = { ...routeContext, ...beforeRender }
    }

    if (route.respond) {
      const customBody = await route.respond({ context: routeContext })
      return response.end(customBody)
    }

    const body = hbs(routeContext)
    return response.end(body)
  }

}

module.exports = serveRoute
