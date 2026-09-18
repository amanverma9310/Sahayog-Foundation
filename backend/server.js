// Using the side-effecting 'dotenv/config' entrypoint (rather than
// `import dotenv from 'dotenv'; dotenv.config()`) matters here: in ESM,
// ALL of a module's imports are resolved and evaluated before any of its
// own body statements run, regardless of where those statements are
// textually written. That means a `dotenv.config()` call placed between
// import lines still runs AFTER every import below it has already been
// evaluated — including the deep chain through app.js -> routes ->
// controllers -> config/razorpay.js, which reads process.env at import
// time. Importing 'dotenv/config' as its own import statement makes the
// config() call part of THIS import's evaluation, so it runs before the
// next sibling import (./src/app.js) is evaluated.
import 'dotenv/config'

import { connectDB } from './src/config/db.js'
import app from './src/app.js'

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION — shutting down...', err)
  process.exit(1)
})

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  const server = app.listen(PORT, () => {
    console.log(`Sahayog Foundation API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
  })

  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION — shutting down...', err)
    server.close(() => process.exit(1))
  })

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...')
    server.close(() => console.log('Process terminated.'))
  })
}

start()
