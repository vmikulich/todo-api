import { Request, Response } from 'express'
import TodoItem, { ITodoItem } from '../models/TodoItem'

async function getAll (req: Request, res: Response) {
  res.json({message: 'Todo items'})
}

async function create (req: Request, res: Response) {
  
}

async function remove (req: Request, res: Response) {
  
}

export const controller = {
  getAll,
  create,
  remove
}