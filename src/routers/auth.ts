import express, { Router } from 'express'
import { controller } from '../controllers/auth'

const authRouter = express.Router()

authRouter.post('/login', controller.login)
authRouter.post('/registration', controller.register)

export { authRouter }