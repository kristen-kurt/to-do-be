import express from 'express'
import {create, deleteById, getAll, update} from '../controllers/todoController'
import { authenticateToken } from '../middleware/auth'


const router = express.Router()
router.use(authenticateToken)

router.get('/', getAll)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', deleteById)

export default router