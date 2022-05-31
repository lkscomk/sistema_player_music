const jwt = require('jsonwebtoken')
module.exports = app => {
    const verify = async (req, res, next) => {
        try {
            const token = String(req['headers'].authorization).replace('Bearer ', '')
            jwt.verify(token, 'lukas')
            next();
        } catch (error) {
            return res.status(401).send(error)
        }
    }
    return {
        verify
    }
}
