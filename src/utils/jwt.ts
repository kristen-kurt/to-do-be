const jwt = require('jsonwebtoken')
export interface JWTPayload {
    userId: number
    email: string
}

export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    })
}

export const verifyToken = (token: string): JWTPayload => {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
}