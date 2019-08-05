exports.uri = '/json'

exports.contentType = 'application/json'

exports.respond = async () => {
  return JSON.stringify({
    this_is_in: 'json'
  })
}
