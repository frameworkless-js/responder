const glob = require('glob')

const { responder } = require('../index')
const MockResponse = require(`${__dirname}/mocks/response`)

const tests = glob.sync(`${__dirname}/tests/**.js`)

const run = async () => {
  for (const file of tests) {
    const { run, description } = require(file)

    console.log(`\n=> ${description}`)

    const start = Date.now()
    await run(responder, { MockResponse })
    const finish = Date.now()

    console.log(`✔  Passed (${finish - start}ms)`)
  }
}

run().then(() => {
  console.log('\n=> Test suite passed!')
}).catch(error => {
  console.error('\n=> Test suite failed:', error)
})
