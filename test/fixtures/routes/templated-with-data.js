exports.uri = '/data_hook'

exports.template = 'datahook'

exports.data = async () => {
  return { variable_from_hook: 'such wow' }
}
