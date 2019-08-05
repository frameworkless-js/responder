const assert = require('assert')
const { readFileSync } = require('fs')
const { lookup } = require('mime-types')

exports.description = 'A 404 is shown when file is not found'

exports.run = async (responder, { MockResponse }) => {
  const instance = responder({
    static: { directory: './test/fixtures/static' },

    handleError: error => {
      assert.deepStrictEqual(error.type, 'not_found')
    }
  })

  const response = new MockResponse()

  await instance({ url: '/404.txt' }, response)

  assert.deepStrictEqual(response.statusCode, 404)
}
