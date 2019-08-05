const assert = require('assert')
const { readFileSync } = require('fs')
const { lookup } = require('mime-types')

exports.description = 'Testing requesting a static file'

exports.run = async (responder, { MockResponse }) => {
  const instance = responder({
    static: { directory: './test/fixtures/static' }
  })

  const response = new MockResponse()

  const start = Date.now()
  await instance({ url: '/test.txt', method: 'GET' }, response)
  const finish = Date.now()

  assert.deepStrictEqual(response.body, readFileSync('./test/fixtures/static/test.txt', 'utf8'))
  assert.deepStrictEqual(response.statusCode, 200)
  assert.deepStrictEqual(response.headers['Content-Type'], lookup('.txt'))

  return { start, finish }
}
