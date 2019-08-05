module.exports = {
  errorPage: './static/error.html',

  static: {
    allowedExtensions: [
      'jpg',
      'jpeg',
      'gif',
      'png',
      'css',
      'svg',
      'ico',
      'js',
      'xml',
      'webmanifest',
      'txt',
      'eot',
      'ttf',
      'woff',
      'html'
    ]
  },

  routes: {
    baseTemplate: 'template'
  },

  formParser: null
}
