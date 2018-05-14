process.env['NODE_ENV'] = '';
const logger = require('./src/logger');

let port = 3000

logger.info(`Current env is ${process.env['NODE_ENV']}`)
if (process.env['NODE_ENV'] == 'production') {
  port = 80
  logger.info('redirecting console output to logger')
  console.warn = logger.warn.bind(logger)
  console.info = logger.info.bind(logger)
  console.error = logger.error.bind(logger)
}

const app = require('./src/app');

// Start listening for requests.
app.listen(port, '0.0.0.0');

process.on('uncaughtException', err => console.error('uncaught exception:', err.toString()));
process.on('unhandledRejection', error => console.error('unhandled rejection:', error.toString()));
