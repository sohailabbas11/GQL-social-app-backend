const User = require('../../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../../config')
const { UserInputError } = require('apollo-server')
const { validateRegisterInput, validateLoginInput } = require('../../util/validators')

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.usename,
    }, SECRET_KEY, { expiresIn: '1h' })
}
module.exports = {
    Mutation: {
        async login(_, { usename, password }) {
            const { errors, valid } = validateLoginInput(username, password)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            const user = await User.findOne({ usename })

            if (!user) {
                errors.general = 'user not found'
                throw new UserInputError('user not found', { errors })
            }
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = 'wrong credentials'
                throw new UserInputError('wrong credentials', { errors })
            }
            const token = generateToken(user)
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_, {
            registerInput: { username, email, password, confirmpassword }
        }) {
            const { valid, errors } = validateRegisterInput(username, email, password, confirmpassword)
            if (!valid) {
                throw new UserInputError('errors', { errors });
            }
            const user = await user.findOne({ username })
            if (user) {
                throw new UserInputError('username is taken', {
                    errors: {
                        username: 'this username is taken'
                    }
                })
            }
            password = await bcrypt.hash(password, 12)
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })
            const res = await newUser.save()

            const token = generateToken(res)
            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}