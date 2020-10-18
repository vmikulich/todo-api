import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

async function login (req: Request, res: Response) {
  const candidate: IUser | null = await User.findOne({email: req.body.email})

  if (candidate) {
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
    if (passwordResult) {
      const token = jwt.sign({
        userId: candidate._id,
        email: candidate.email
      }, `${process.env.JWT}`, {expiresIn: 3600})
      res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      res.status(401).json({
        message: 'Passwords do not match.'
      })
    }
  } else {
    res.status(404).json({
      message: 'User with this email is not found.'
    })
  }
}

async function register (req: Request, res: Response) {
  const candidate: IUser | null = await User.findOne({email: req.body.email})  

  if (candidate) {
    res.status(409).json({
      message: 'Such email has already in use. Please try another one.'
    })
  } else {
    const salt: HashAlgorithmIdentifier = bcrypt.genSaltSync(10)
    const password: string = req.body.password
    const user: IUser = new User({
      nickname: req.body.nickname,
      email: req.body.email,
      password: bcrypt.hashSync(password, salt)
    })
    try {
      await user.save()
      res.status(201).json(user)
      
    } catch (error) {

    }
  }
}

export const controller = {
  login,
  register
}