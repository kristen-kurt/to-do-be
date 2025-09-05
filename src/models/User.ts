import { pool } from '../config/database'

export interface User {
    id: number
    email: string
    name: string
    password: string
    picture?: string
    created_at: Date
}

export interface CreateUserData {
    email: string
    name: string
    password: string
}

export interface UserResponse {
    id: number
    email: string
    name: string
    picture?: string
    created_at?: Date
}

export class UserModel {
    static async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        return result.rows[0] || null
    }

    static async create(userData: CreateUserData): Promise<User> {
        const { email, name, password } = userData
        const result = await pool.query(
            'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name, password, created_at',
            [email, name, password]
        )
        return result.rows[0]
    }

    static async findById(id: number): Promise<User | null> {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
        return result.rows[0] || null
    }

    static toUserResponse(user: User): UserResponse {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            created_at: user.created_at
        }
    }
}