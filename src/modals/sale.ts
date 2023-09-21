import { User } from 'modals'
import { ObjectId } from 'mongodb'

export interface Sale {
  _id: ObjectId
  description: string
  createdDateTime: string
  updatedDateTime: string
  category: Category
  originalPrice: string
  updatedPrice: string
  user: User
  imageUrl?: string
  status: SaleStatus
  location?: Location
}

export enum SaleStatus {
  AVAILABLE = 'available',
  OFFLINE = 'offline',
  DELETED = 'deleted'
}

export enum Category {
  SPORTS = 'Sports',
  AUTOMOTIVE = 'Automotive',
  GARDEN = 'Garden',
  FASHION = 'Fashion',
  HOME = 'Home',
  TOYS = 'Toys'
}
