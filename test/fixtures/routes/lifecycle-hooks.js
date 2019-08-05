exports.uri = '/hooks'

exports.template = 'with_hooks'

exports.onRequest = async () => {
  return {
    hooks: [ 'onRequest' ]
  }
}

exports.beforeRender = async ({ context }) => {
  const hooks = context.hooks.concat([ 'beforeRender' ])
  return { hooks }
}
