class MockResponse {

  statusCode = null
  headers = null
  body = null

  writeHead(statusCode = 200, headers = {}) {
    this.statusCode = statusCode
    this.headers = headers
  }

  end(body) {
    this.body = body.toString()
  }

}

module.exports = MockResponse
