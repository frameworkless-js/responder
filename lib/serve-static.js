const { open } = require('fs').promises
const { lookup } = require('mime-types')

const serveStatic = ({ directory, allowedExtensions } = {}) => (

  async ({ pathname, extension, statusCode }, response) => {
    if (allowedExtensions && allowedExtensions.indexOf(extension) === -1) throw new Error('not_found')

    let fileHandle

    try {
      fileHandle = await open(`${directory}${pathname}`, 'r')
      const staticFile = await fileHandle.readFile()

      const mime = lookup(extension)
      if (!mime) throw new Error('not_found')

      response.writeHead(statusCode || 200, {
        'Content-Type': mime
      })

      return response.end(staticFile)
    } catch (error) {
      throw new Error('not_found')
    } finally {
      if (fileHandle) fileHandle.close()
    }
  }

)

module.exports = serveStatic
