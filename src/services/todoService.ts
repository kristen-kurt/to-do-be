// services/todoService.ts
import { TodoModel, CreateTodoData, UpdateTodoData, Todo } from '../models/Todo'

export interface CreateTodoInput {
    title: string
    completed?: boolean
    user_id: number
}

export interface UpdateTodoInput {
    title?: string
    completed?: boolean
}

export class TodoService {
    static validateTitle(title: string): boolean {
        return Boolean(title && title.trim().length > 0)
    }

    static validateId(id: string): boolean {
        return Boolean(id && !isNaN(Number(id)))
    }

    static async createTodo(input: CreateTodoInput): Promise<Todo> {
        const { title, completed = false, user_id } = input

        if (!this.validateTitle(title)) {
            throw new Error('Title is required')
        }

        if (!user_id) {
            throw new Error('User authentication required')
        }

        const todoData: CreateTodoData = {
            title: title.trim(),
            completed,
            user_id
        }

        return await TodoModel.create(todoData)
    }

    static async getAllTodos(user_id: number | undefined): Promise<Todo[]> {
        if (!user_id) {
            throw new Error('User authentication required')
        }

        return await TodoModel.findAllByUserId(user_id)
    }

    static async updateTodo(id: string, user_id: number | undefined, updateData: UpdateTodoInput): Promise<Todo> {
        if (!user_id) {
            throw new Error('User authentication required')
        }

        if (!this.validateId(id)) {
            throw new Error('Invalid ID')
        }

        const existingTodo = await TodoModel.findByIdAndUserId(Number(id), user_id)
        if (!existingTodo) {
            throw new Error('Task not found')
        }

        const updates: UpdateTodoData = {}

        if (updateData.title !== undefined) {
            if (!this.validateTitle(updateData.title)) {
                throw new Error('Title cannot be empty')
            }
            updates.title = updateData.title.trim()
        }

        if (updateData.completed !== undefined) {
            updates.completed = updateData.completed
        }

        if (Object.keys(updates).length === 0) {
            throw new Error('No valid fields to update')
        }

        return await TodoModel.update(Number(id), user_id, updates)
    }

    static async deleteTodo(id: string, user_id?: number): Promise<{ id: number, title: string }> {
        if (!user_id) {
            throw new Error('User authentication required')
        }

        if (!this.validateId(id)) {
            throw new Error('Valid todo ID is required')
        }

        const deletedTodo = await TodoModel.deleteByIdAndUserId(Number(id), user_id)
        if (!deletedTodo) {
            throw new Error('Task not found')
        }

        return deletedTodo
    }
}