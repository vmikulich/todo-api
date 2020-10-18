import express from 'express'
import passport from 'passport'
import { controller } from '../controllers/todoItem'

const todoItemRouter = express.Router()

todoItemRouter.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)
todoItemRouter.post('/', controller.create)
todoItemRouter.delete('/:id', controller.remove)

export { todoItemRouter }