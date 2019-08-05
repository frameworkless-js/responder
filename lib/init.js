const { readFileSync } = require('fs')
const path = require('path')
const glob = require('glob')

const responder = require('./responder')
const DEFAULT_OPTIONS = require('../config/default-options')

const loadRoutes = (routeDirectory, { directory: templateDirectory } = {}) => {
  try {
    const routePath = path.relative(path.resolve('./'), routeDirectory)
    const files = glob.sync(`${routePath}/**/*.js`)

    return files.reduce((routeMap, filename) => {
      const filePath = path.join(path.resolve('./'), path.relative(path.resolve('./'), filename))
      const route = require(filePath)
      const key = `${route.method || 'GET'}:${route.uri}`

      if (route.template && templateDirectory) {
        const filename = `${templateDirectory}/${route.template}`
        const hbsPath = path.join(path.resolve('./'), path.relative(path.resolve('./'), filename))

        route.body = readFileSync(`${hbsPath}.hbs`, { encoding: 'utf8' })
      } else if (route.template && !templateDirectory) {
        console.warn(`Route ${key} specifies a template, but no routes.templates.directory is set!`)
      }

      routeMap[key] = route

      return routeMap
    }, {})
  } catch (error) {
    throw new Error(`@frameworkless/responder could not load routes.directory: ${routeDirectory}`)
  }
}

const init = ({ static, routes, errorPage, handleError } = {}) => {
  // If we have no routes or static files, what are we doing here? ;)
  if (
    (!static || !static.directory)
    && (!routes || !routes.directory)
  ) throw new Error('Please specify a `static.directory` and/or a `route.directory`.')

  const context = {}

  try {
    context.errorPage = readFileSync(errorPage || DEFAULT_OPTIONS.errorPage, 'utf8')
  } catch (error) {
    throw new Error(`@frameworkless/responder could not load errorPage: ${errorPage}`)
  }

  if (routes) {
    context.routes = {
      routes: loadRoutes(routes.directory, routes.templates)
    }

    if (routes.templates && routes.templates.base) context.routes.base = routes.templates.base
  }

  if (static && static.directory) {
    context.static = {
      directory: static.directory
    }
  }

  if (handleError) context.handleError = handleError

  return responder(context)
}

module.exports = init
