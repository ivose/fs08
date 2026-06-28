require('node:dns').setServers(['1.1.1.1', '8.8.8.8'])
require('dotenv').config()

const connectToDatabase = require('./db')
const startServer = require('./server')

const MONGODB_URI = process.env.MONGODB_URI
const PORT = Number(process.env.PORT) || 4000

const main = async () => {
  await connectToDatabase(MONGODB_URI)
  await startServer(PORT)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})