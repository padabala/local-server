import { ObjectId } from 'mongodb'

export interface UserDetails {
  _id: ObjectId
  firstName: string
  lastName: string
  email: string
  phone?: string
}
export interface UserProfile extends UserDetails {}
export interface User extends UserDetails {
  password: string
}
