const mongoose = require('mongoose')

// Connect to the local MongoDB instance using the database name from environment variables.
mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`)

// Access the shared Mongoose connection object.
const db = mongoose.connection

// Log connection errors to make startup issues visible in development.
db.on('error', console.error.bind(console, 'connection error:'))

// Log a success message once the initial connection is established.
db.once('open', () => {
    console.log(`connected to`, db.client.s.url)
})
