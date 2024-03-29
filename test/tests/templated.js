const assert = require('assert')
const { readFileSync } = require('fs')
const { lookup } = require('mime-types')
const Handlebars = require('handlebars')

exports.description = 'Testing requesting a simple templated route'

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

  const start = Date.now()
  await instance({ url: '/template', method: 'GET' }, response)
  const finish = Date.now()

  const shouldBeBody = Handlebars.compile(readFileSync('./test/fixtures/base.hbs', 'utf8'))
  Handlebars.registerPartial('content', readFileSync('./test/fixtures/templates/templated.hbs', 'utf8'))

  assert.deepStrictEqual(response.body, shouldBeBody())
  assert.deepStrictEqual(response.statusCode, 200)
  assert.deepStrictEqual(response.headers['Content-Type'], lookup('.html'))

  return { start, finish }
}
