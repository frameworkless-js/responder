const assert = require('assert')
const { readFileSync } = require('fs')
const { lookup } = require('mime-types')
const Handlebars = require('handlebars')

exports.description = 'Testing requesting a templated route with datahooks'

exports.run = async (responder, { MockResponse }) => {
  const instance = responder({
    routes: {
      directory: 'test/fixtures/routes',
      templates: {
        base: 'test/fixtures/base.hbs',
        directory: 'test/fixtures/templates'
      }
    }
  })

  const response = new MockResponse()

  await instance({ url: '/hooks', method: 'GET' }, response)

  const shouldBeBody = Handlebars.compile(readFileSync('./test/fixtures/base.hbs', 'utf8'))
  Handlebars.registerPartial('content', readFileSync('./test/fixtures/templates/with_hooks.hbs', 'utf8'))

  assert.deepStrictEqual(response.body, shouldBeBody({ hooks: [ 'onRequest', 'beforeRender' ] }))
  assert.deepStrictEqual(response.statusCode, 200)
  assert.deepStrictEqual(response.headers['Content-Type'], lookup('.html'))
}
