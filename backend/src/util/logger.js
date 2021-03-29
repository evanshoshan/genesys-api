const bunyan = require('bunyan')

/**
 * Get streams for logger
 */
const getStreams = () => {
  const streams = [{
    level: 'error',
    stream: process.stdout
  }]

  if (process.env.NODE_ENV !== 'production') {
    streams.push(
      {
        level: 'debug',
        stream: process.stdout
      }
    )
  }

  return streams
}

module.exports.createLogger = name => {
  return bunyan.createLogger({
    name: `api-${name}`,
    streams: getStreams()
  })
}
