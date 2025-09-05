import { pool } from '../config/database'

export interface Todo {
    id: number
    title: string
    completed: boolean
    user_id: number
    created_at: Date
    updated_at: Date
}

export interface CreateTodoData {
    title: string
    completed: boolean
    user_id: number
}

export interface UpdateTodoData {
    title?: string
    completed?: boolean
}

export class TodoModel {
    static async create(todoData: CreateTodoData): Promise<Todo> {
        const { title, completed, user_id } = todoData
        const result = await pool.query(
            'INSERT INTO todos (title, completed, user_id) VALUES ($1, $2, $3) RETURNING id, title, completed, user_id, created_at, updated_at',
            [title, completed, user_id]
        )
        return result.rows[0]
    }

    static async findAllByUserId(user_id: number): Promise<Todo[]> {
        const result = await pool.query(
            'SELECT id, title, completed FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
            [user_id]
        )
        return result.rows
    }

    static async findByIdAndUserId(id: number, user_id: number): Promise<Todo | null> {
        const result = await pool.query(
            'SELECT id FROM todos WHERE id = $1 AND user_id = $2',
            [id, user_id]
        )
        return result.rows[0] || null
    }

    static async update(id: number, user_id: number, updates: UpdateTodoData): Promise<Todo> {
        const updateFields = []
        const values = []
        let paramCount = 1

        if (updates.title !== undefined) {
            updateFields.push(`title = $${paramCount}`)
            values.push(updates.title)
            paramCount++
        }

        if (updates.completed !== undefined) {
            updateFields.push(`completed = $${paramCount}`)
            values.push(updates.completed)
            paramCount++
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
        values.push(id, user_id)

        const query = `
            UPDATE todos 
            SET ${updateFields.join(', ')} 
            WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
            RETURNING id, title, completed, user_id, created_at, updated_at
        `

        const result = await pool.query(query, values)
        return result.rows[0]
    }

    static async deleteByIdAndUserId(id: number, user_id: number): Promise<{ id: number, title: string } | null> {
        const result = await pool.query(
            'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id, title',
            [id, user_id]
        )
        return result.rows[0] || null
    }
}