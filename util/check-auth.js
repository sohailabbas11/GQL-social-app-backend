const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')

module.exports = (context) => {
    // context = { ... headers }
    const authHeader = context.req.headers.authorization
    if (authHeader) {
        // Bearer ... 
        const token = authHeader.split('Bearer')[1]
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY)
                return user
            } catch (err) {
                throw new AuthenticationError('invalid/expired token')
            }
        }
        throw new Error('authentication token must be Bearer[token]')
    }
    throw new Error('authorization header must be provided')

}