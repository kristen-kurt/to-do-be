import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

export interface AuthRequest extends Request {
    user?: {
        userId: number
        email: string
    }
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        req.user = decoded

        next()
    } catch (error) {
        console.error('Auth middleware error:', error)
        return res.status(401).json({ error: 'Invalid token' })
    }
}