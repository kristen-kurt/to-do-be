import { Request, Response } from 'express'
import { AuthService } from '../services/authService'

export const register = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body

        const result = await AuthService.register({ email, name, password })

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: result.user,
            token: result.token
        })
    } catch (error: any) {
        const statusCode = error.message.includes('already exists') ? 400 :
            error.message.includes('required') || error.message.includes('valid') ? 400 : 500

        res.status(statusCode).json({
            success: false,
            message: statusCode === 500 ? 'Registration failed. Please try again.' : error.message
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const result = await AuthService.login({ email, password })

        res.json({
            success: true,
            message: 'Login successful',
            user: result.user,
            token: result.token
        })
    } catch (error: any) {
        const statusCode = error.message.includes('Invalid email or password') ? 401 :
            error.message.includes('required') || error.message.includes('valid') ? 400 : 500

        res.status(statusCode).json({
            success: false,
            message: statusCode === 500 ? 'Login failed. Please try again.' : error.message
        })
    }
}