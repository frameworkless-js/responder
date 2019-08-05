const assert = require('assert')
const { lookup } = require('mime-types')

exports.description = 'Testing requesting a route with an overriding respond() function (for example for API)'

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
  await instance({ url: '/json', method: 'GET' }, response)
  const finish = Date.now()

  assert.deepStrictEqual(response.body, JSON.stringify({ this_is_in: 'json' }))
  assert.deepStrictEqual(response.statusCode, 200)
  assert.deepStrictEqual(response.headers['Content-Type'], lookup('.json'))

  return { start, finish }
}
