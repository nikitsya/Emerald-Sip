const router = require(`express`).Router()
const createError = require('http-errors')
const usersModel = require(`../models/users`)
const bcrypt = require('bcryptjs')  // needed for password encryption

const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')
const jwt = require('jsonwebtoken')

// If a user with this email does not already exist, then create new user
router.post(`/users/register/:name/:email/:password`, (req, res, next) => {
    usersModel.findOne({email: req.params.email})
        .then(uniqueData => {
            if (uniqueData) {
                next(createError(403, `User already exists`))
            } else {
                bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (error, hash) => {
                    if (error) {
                        return next(error)
                    }

                    usersModel.create({
                        name: req.params.name,
                        email: req.params.email,
                        password: hash,
                        accessLevel: parseInt(process.env.ACCESS_LEVEL_CUSTOMER)
                    })
                        .then(data => {
                            const token = jwt.sign({
                                email: data.email,
                                accessLevel: data.accessLevel
                            }, JWT_PRIVATE_KEY, {algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY})
                            res.json({name: data.name, accessLevel: data.accessLevel, token: token})
                        })
                        .catch(() => next(createError(409, `User was not registered`)))
                })
            }
        })
        .catch(err => next(err))
})

router.post(`/users/login/:email/:password`, (req, res, next) => {
    usersModel.findOne({email: req.params.email})
        .then((data) => {
            if (!data) {
                return res.json({errorMessage: `User is not logged in`})
            }

            bcrypt.compare(req.params.password, data.password, (err, result) => {
                if (err) {
                    return next(err)
                }

                if (result) {
                    const token = jwt.sign({
                        email: data.email,
                        accessLevel: data.accessLevel
                    }, JWT_PRIVATE_KEY, {algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY})
                    res.json({name: data.name, accessLevel: data.accessLevel, token: token})
                } else {
                    res.json({errorMessage: `User is not logged in`})
                }
            })
        })
        .catch((err) => next(err))
})

router.post(`/users/logout`, (req, res, next) => {

    res.json({})
})

module.exports = router
