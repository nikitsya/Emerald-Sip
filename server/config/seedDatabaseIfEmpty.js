const fs = require(`fs`)
const path = require(`path`)
const mongoose = require(`mongoose`)

const productsModel = require(`../models/products`)
const usersModel = require(`../models/users`)
const salesModel = require(`../models/sales`)

const SEED_DIRECTORY = path.join(__dirname, `..`, `seeds`, `default`)

const readSeedArray = (filename) => {
    const filePath = path.join(SEED_DIRECTORY, filename)

    if (!fs.existsSync(filePath)) {
        return []
    }

    const raw = fs.readFileSync(filePath, `utf8`)
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
}

const seedDatabaseIfEmpty = async () => {
    const [productsCount, usersCount, salesCount] = await Promise.all([
        productsModel.countDocuments(),
        usersModel.countDocuments(),
        salesModel.countDocuments()
    ])

    if (productsCount > 0 || usersCount > 0 || salesCount > 0) {
        return {
            seeded: false,
            reason: `database_not_empty`,
            productsCount,
            usersCount,
            salesCount
        }
    }

    const seedProducts = readSeedArray(`products.json`)
    const seedUsers = readSeedArray(`users.json`)
    const seedSales = readSeedArray(`sales.json`)

    if (seedProducts.length > 0) {
        await productsModel.insertMany(seedProducts)
    }

    if (seedUsers.length > 0) {
        await usersModel.insertMany(seedUsers)
    }

    if (seedSales.length > 0) {
        await salesModel.insertMany(seedSales)
    }

    return {
        seeded: true,
        insertedProducts: seedProducts.length,
        insertedUsers: seedUsers.length,
        insertedSales: seedSales.length
    }
}

const runSeedLocalIfEmpty = async () => {
    require(`dotenv`).config({path: path.join(__dirname, `.env`)})
    await mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`)

    try {
        const result = await seedDatabaseIfEmpty()
        if (result.seeded) {
            console.log(
                `Seed inserted:`,
                `products=${result.insertedProducts},`,
                `users=${result.insertedUsers},`,
                `sales=${result.insertedSales}`
            )
        } else {
            console.log(
                `Seed skipped:`,
                `products=${result.productsCount},`,
                `users=${result.usersCount},`,
                `sales=${result.salesCount}`
            )
        }
    } finally {
        await mongoose.disconnect()
    }
}

if (require.main === module) {
    runSeedLocalIfEmpty().catch((error) => {
        console.error(error.message)
        process.exit(1)
    })
}

module.exports = {seedDatabaseIfEmpty, runSeedLocalIfEmpty}
