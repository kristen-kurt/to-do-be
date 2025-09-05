import bcrypt from 'bcryptjs'
import { UserModel, CreateUserData, UserResponse } from '../models/User'
import { generateToken } from '../utils/jwt'

export interface RegisterData {
    email: string
    name: string
    password: string
}

export interface LoginData {
    email: string
    password: string
}

export interface AuthResponse {
    user: UserResponse
    token: string
}

export class AuthService {
    private static readonly SALT_ROUNDS = 12
    private static readonly MIN_PASSWORD_LENGTH = 6

    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    static validatePassword(password: string): boolean {
        return !!(password && password.length >= this.MIN_PASSWORD_LENGTH)
    }

    static validateName(name: string): boolean {
        return !!(name && name.trim().length > 0)
    }

    static async register(registerData: RegisterData): Promise<AuthResponse> {
        const { email, name, password } = registerData

        // Validation
        if (!this.validateName(name)) {
            throw new Error('Name is required')
        }

        if (!email?.trim()) {
            throw new Error('Email is required')
        }

        if (!this.validateEmail(email)) {
            throw new Error('Please provide a valid email address')
        }

        if (!this.validatePassword(password)) {
            throw new Error('Password must be at least 6 characters long')
        }

        const normalizedEmail = email.toLowerCase().trim()
        const trimmedName = name.trim()

        // Check if user exists
        const existingUser = await UserModel.findByEmail(normalizedEmail)
        if (existingUser) {
            throw new Error('User with this email already exists')
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS)

        // Create user
        const userData: CreateUserData = {
            email: normalizedEmail,
            name: trimmedName,
            password: hashedPassword
        }

        const user = await UserModel.create(userData)
        const token = generateToken({ userId: user.id, email: user.email })

        return {
            user: UserModel.toUserResponse(user),
            token
        }
    }

    static async login(loginData: LoginData): Promise<AuthResponse> {
        const { email, password } = loginData

        // Validation
        if (!email?.trim()) {
            throw new Error('Email is required')
        }

        if (!this.validateEmail(email)) {
            throw new Error('Please provide a valid email address')
        }

        if (!password?.trim()) {
            throw new Error('Password is required')
        }

        // Find user
        const user = await UserModel.findByEmail(email.toLowerCase().trim())
        if (!user) {
            throw new Error('Invalid email or password')
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            throw new Error('Invalid email or password')
        }

        // Generate token
        const token = generateToken({ userId: user.id, email: user.email })

        return {
            user: UserModel.toUserResponse(user),
            token
        }
    }
}