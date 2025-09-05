import { Request, Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { TodoService } from '../services/todoService'

export const create = async (req: AuthRequest, res: Response) => {
    try {
        const { title, completed = false } = req.body
        const user_id = req.user?.userId
        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            })
        }

        const todo = await TodoService.createTodo({ title, completed, user_id })

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: {
                id: todo.id,
                title: todo.title,
                completed: todo.completed,
                user_id: todo.user_id,
                created_at: todo.created_at,
                updated_at: todo.updated_at
            }
        })
    } catch (error: any) {
        const statusCode = error.message.includes('required') ?
            (error.message.includes('authentication') ? 401 : 400) : 500

        res.status(statusCode).json({
            success: false,
            message: statusCode === 500 ? 'Failed to create task. Please try again.' : error.message,
            ...(statusCode === 500 && {
                title: req.body.title,
                completed: req.body.completed || false,
                user_id: req.user?.userId
            })
        })
    }
}

export const getAll = async (req: AuthRequest, res: Response) => {
    try {
        const user_id = req.user?.userId

        const todos = await TodoService.getAllTodos(user_id)

        res.json({
            success: true,
            message: 'Fetch tasks successfully',
            data: todos,
            count: todos.length
        })
    } catch (error: any) {
        const statusCode = error.message.includes('authentication') ? 401 : 500

        res.status(statusCode).json({
            success: false,
            message: statusCode === 500 ? 'Failed to retrieve tasks' : error.message
        })
    }
}

export const update = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params
        const { title, completed } = req.body
        const user_id = req.user?.userId

        const updatedTodo = await TodoService.updateTodo(id, user_id, { title, completed })

        res.json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTodo
        })
    } catch (error: any) {
        const statusCode = error.message.includes('authentication') ? 401 :
            error.message.includes('not found') ? 404 :
                error.message.includes('Invalid') || error.message.includes('empty') || error.message.includes('No valid') ? 400 : 500

        res.status(statusCode).json({
            success: false,
            message: statusCode === 500 ? 'Failed to update task. Please try again.' : error.message
        })
    }
}

export const deleteById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params
        const user_id = req.user?.userId

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            })
        }

        const deletedTodo = await TodoService.deleteTodo(id, user_id)

        res.json({
            success: true,
            message: 'Task deleted successfully',
            data: {
                id: deletedTodo.id,
                title: deletedTodo.title
            }
        })
    } catch (error: any) {
        const statusCode = error.message.includes('not found') ? 404 :
            error.message.includes('required') || error.message.includes('Invalid') ? 400 : 500

        res.status(statusCode).json({
            success: false,
            message: statusCode === 500 ? 'Failed to delete task. Please try again.' : error.message
        })
    }
}