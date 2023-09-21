import express, { Request, Response } from 'express'
import { createUserToDb, getUserFromDb } from '../services'
import { User, UserProfile } from 'modals'
import { ObjectId } from 'mongodb'

export const usersRouter = express.Router()

usersRouter.use(express.json())

usersRouter.post('/users/register', async (_req: Request, res: Response) => {
  try {
    let user: User = {
      _id: new ObjectId(),
      firstName: _req.body.firstName,
      lastName: _req.body.lastName,
      email: _req.body.email,
      phone: _req.body.phone,
      password: _req.body.password
    }

    console.log('/users/register: ' + JSON.stringify(user))
    const createdUser = await createUserToDb(user)
    console.log('result: ' + JSON.stringify(createdUser))
    if (createdUser) {
      const profile: UserProfile = {
        _id: createdUser?._id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        phone: createdUser.phone
      }
      res.status(200).send(profile)
    } else {
      res.status(404).send('Could not create user')
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

usersRouter.post('/users/login', async (_req: Request, res: Response) => {
  try {
    console.log('/users/login' + JSON.stringify(_req.body))
    console.log('email' + JSON.stringify(_req.body.email))
    console.log('password' + JSON.stringify(_req.body.password))
    // Connect the client to the server	(optional starting in v4.7)
    const email = _req.body.email
    const password = _req.body.password
    const user = await getUserFromDb(email, password)

    if (user) {
      const profile: UserProfile = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      }
      res.status(200).send(profile)
    } else {
      res.status(404).send('User not found')
    }
  } catch (error) {
    res.status(500).send(error)
  }
})
