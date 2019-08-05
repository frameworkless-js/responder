const assert = require('assert')
const { readFileSync } = require('fs')
const { lookup } = require('mime-types')
const Handlebars = require('handlebars')

exports.description = 'Testing requesting a templated route with a data hook set'

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

  await instance({ url: '/data_hook' }, response)

  const shouldBeBody = Handlebars.compile(readFileSync('./test/fixtures/base.hbs', 'utf8'))
  Handlebars.registerPartial('content', readFileSync('./test/fixtures/templates/datahook.hbs', 'utf8'))

  assert.deepStrictEqual(response.body, shouldBeBody({ variable_from_hook: 'such wow' }))
  assert.deepStrictEqual(response.statusCode, 200)
  assert.deepStrictEqual(response.headers['Content-Type'], lookup('.html'))
}
