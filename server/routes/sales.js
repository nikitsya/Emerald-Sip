const router = require(`express`).Router()
const createError = require(`http-errors`)
const fs = require(`fs`)
const jwt = require(`jsonwebtoken`)
const salesModel = require(`../models/sales`)

const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, `utf8`)

// Normalizes basket payload and strips invalid entries before persistence.
const normalizeItems = (items) => {
    if (!Array.isArray(items)) return []
    return items
        .filter((item) => item && item._id)
        .map((item) => ({
            _id: String(item._id),
            name: String(item.name || ``).trim(),
            price: Number(item.price) || 0,
            quantity: Math.max(1, Number(item.quantity) || 1)
        }))
}

// Accepts only finite non-negative totals from URL params.
const parseTotal = (totalParam) => {
    const total = Number(totalParam)
    if (!Number.isFinite(total) || total < 0) {
        return null
    }
    return total
}

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ``).trim())
const isPhoneValid = (phone) => /^\d{7,15}$/.test(String(phone || ``).trim())

// Logged-in customer purchase (JWT required)
router.post(`/sales/:orderID/:total`, (req, res, next) => {
    // JWT is required to bind the sale to the authenticated account email.
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithms: [`HS256`]}, (err, decodedToken) => {
        if (err || !decodedToken) {
            return next(createError(403, `User is not logged in`))
        }

        // Prevents malformed totals from being stored in sales history.
        const total = parseTotal(req.params.total)
        if (total === null) {
            return next(createError(400, `Invalid total amount`))
        }

        // Reject empty or malformed carts early.
        const items = normalizeItems(req.body.items)
        if (items.length === 0) {
            return next(createError(400, `Sale must contain at least one item`))
        }

        // For registered checkout, email source is the JWT payload, not request body.
        const customerEmail = String(decodedToken.email || ``).trim()
        if (!isEmailValid(customerEmail)) {
            return next(createError(400, `Invalid customer email`))
        }

        // Store a unified sale record format for both registered and guest flows.
        const saleDetails = {
            orderID: String(req.params.orderID || ``).trim(),
            total,
            items,
            isGuest: false,
            customerName: String(req.body.customerName || `Registered Customer`).trim(),
            customerEmail,
            customerAddress: String(req.body.customerAddress || ``).trim(),
            customerPhone: String(req.body.customerPhone || ``).trim()
        }

        // Persistence is the final step after all business validations pass.
        salesModel.create(saleDetails)
            .then(() => res.json({success: true}))
            .catch((createErr) => next(createErr))
    })
})

// Guest customer purchase (no JWT)
router.post(`/sales/guest/:orderID/:total`, (req, res, next) => {
    // Guest totals still use the same numeric validation as authenticated checkout.
    const total = parseTotal(req.params.total)
    if (total === null) {
        return next(createError(400, `Invalid total amount`))
    }

    // Enforce non-empty normalized basket before customer-field checks.
    const items = normalizeItems(req.body.items)
    if (items.length === 0) {
        return next(createError(400, `Sale must contain at least one item`))
    }

    const customerName = String(req.body.customerName || ``).trim()
    const customerEmail = String(req.body.customerEmail || ``).trim()
    const customerAddress = String(req.body.customerAddress || ``).trim()
    const customerPhone = String(req.body.customerPhone || ``).trim()

    // Guest checkout requires fully provided contact and delivery fields.
    if (!customerName) return next(createError(400, `Customer name is required`))
    if (!customerAddress) return next(createError(400, `Customer address is required`))
    if (!isPhoneValid(customerPhone)) return next(createError(400, `Customer phone is invalid`))
    if (!isEmailValid(customerEmail)) return next(createError(400, `Customer email is invalid`))

    // Keep DB schema consistent with registered flow by using matching field names.
    const saleDetails = {
        orderID: String(req.params.orderID || ``).trim(),
        total,
        items,
        isGuest: true,
        customerName,
        customerEmail,
        customerAddress,
        customerPhone
    }

    // Save guest order using the same collection for consolidated order history.
    salesModel.create(saleDetails)
        .then(() => res.json({success: true}))
        .catch((createErr) => next(createErr))
})

module.exports = router