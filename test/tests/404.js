const assert = require('assert')

exports.description = 'A 404 is shown when file is not found'

exports.run = async (responder, { MockResponse }) => {
  const instance = responder({
    static: { directory: './test/fixtures/static' },

    handleError: error => {
      assert.deepStrictEqual(error.type, 'not_found')
    }
  })

  const response = new MockResponse()

  const start = Date.now()
  await instance({ url: '/404.txt', method: 'GET' }, response)
  const finish = Date.now()

  assert.deepStrictEqual(response.statusCode, 404)

  return { start, finish }
}
