const errors = {

  not_found: {
    code: 404
  },

  __fallback: {
    code: 500
  }

}

module.exports = new Proxy(errors, {

  get(context, prop) {
    return prop in context ? { type: prop, ...context[prop] } : { type: prop, ...context['__fallback'] }
  }

})
