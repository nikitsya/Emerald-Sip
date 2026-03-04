const mongoose = require('mongoose')

// Prefer cloud URI when provided, otherwise use local MongoDB for development fallback.
const connectionUri = process.env.MONGODB_URI || `mongodb://localhost/${process.env.DB_NAME}`
mongoose.connect(connectionUri)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log("connected to", db.client.s.url)
})
