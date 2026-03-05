const mongoose = require('mongoose')
const {seedDatabaseIfEmpty} = require(`./seedDatabaseIfEmpty`)

mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', async () => {
    console.log(`connected to`, db.client.s.url)

    try {
        const seedResult = await seedDatabaseIfEmpty()
        if (seedResult.seeded) {
            console.log(
                `local seed inserted`,
                `products=${seedResult.insertedProducts}`,
                `users=${seedResult.insertedUsers}`,
                `sales=${seedResult.insertedSales}`
            )
        } else {
            console.log(
                `local seed skipped`,
                `products=${seedResult.productsCount}`,
                `users=${seedResult.usersCount}`,
                `sales=${seedResult.salesCount}`
            )
        }
    } catch (seedError) {
        console.error(`local seed failed:`, seedError.message)
    }
})
