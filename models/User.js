const { model, Schema } = require('mongoose')

const userSchema = new Schema({
    usename: String,
    password: String,
    email: String,
    createdAt: String
})

module.exports = model('user', userSchema)