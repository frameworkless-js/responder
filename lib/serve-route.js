const { readFileSync } = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const URLPattern = require('url-pattern')

const serveRoute = ({ base, routes = {} } = {}) => {
  let baseTemplate

  if (base) {
    const basePath = path.relative(path.resolve('./'), base)
    baseTemplate = readFileSync(basePath, 'utf8')
  }

  return async ({ request, pathname }, response) => {
    let urlParams

    const routeKey = Object.keys(routes).find(routeKey => {
      const [ method, pattern ] = routeKey.split(':')

      if (request.method !== method) return false
      if (request.pattern === pathname) return true

      const urlPattern = new URLPattern(pattern)
      const match = urlPattern.match(pathname)

      if (!match) return false
      else {
        urlParams = match
        return true
      }
    })

    const route = routes[routeKey]
    if (!route) throw new Error('not_found')

    let hbs
    let routeContext = { params: urlParams }

    if (route.onRequest) {
      const onRequest = await route.onRequest({ context: routeContext })
      if (onRequest) routeContext = onRequest
    }

    if (!baseTemplate && route.body) {
      hbs = Handlebars.compile(route.body)
    } else if (baseTemplate && route.body) {
      Handlebars.registerPartial('content', route.body)
      hbs = Handlebars.compile(baseTemplate)
    }

    if (route.data) {
      const routeData = await route.data({ request })
      if (routeData) routeContext = { ...routeContext, ...routeData }
    }

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
