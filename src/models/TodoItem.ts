import mongoose, { Schema, Document } from 'mongoose'
import { IUser } from './User'

export interface ITodoItem extends Document {
  message: string
  tags?: string[]
  user: IUser['_id']
}

const TodoItemSchema: Schema = new Schema({
  message: {
    type: String,
    required: true
  },
  tags: [
    {
      type: String,
      default: ''
    }
  ],
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

export default mongoose.model<ITodoItem>('todoItems', TodoItemSchema)