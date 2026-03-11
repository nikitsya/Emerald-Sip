const mongoose = require(`mongoose`)
const {buildEmailField} = require(`./validators/email`)
const {
    buildTextField,
    buildPhoneField,
    buildIntegerField,
    buildSimpleFilenameField,
    buildBcryptHashField
} = require(`./validators/common`)

let usersSchema = new mongoose.Schema({
    name: buildTextField({fieldLabel: `Name`, required: true, minLength: 2, maxLength: 80, allowEmpty: false}),
    email: buildEmailField({fieldLabel: `Email`, unique: true}),
    password: buildBcryptHashField({fieldLabel: `Password hash`}),
    profilePhotoFilename: buildSimpleFilenameField({fieldLabel: `Profile photo filename`}),
    phone: buildPhoneField({fieldLabel: `Phone`}),
    address: buildTextField({fieldLabel: `Address`, maxLength: 180}),
    accessLevel: buildIntegerField({fieldLabel: `Access level`, required: true, min: 0, max: 10, defaultValue: 1})
}, {
    collection: `users`
})

module.exports = mongoose.model(`users`, usersSchema)
