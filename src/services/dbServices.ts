import { Sale, User } from 'modals'
import { dbClient } from './dbConnection'
import { FindOneAndUpdateOptions, ObjectId } from 'mongodb'
import { error } from 'console'

export const getUserFromDb = async (email: string, password: string) => {
  try {
    await dbClient.connect()
    const database = dbClient.db('fleamarket')
    const users = database.collection('users')
    const query = { email: email, password: password }
    const user = await users.findOne(query)
    return user
  } catch (err) {
    console.error('Error reading user from DB' + JSON.stringify(err))
  } finally {
    await dbClient.close()
  }
}

export const createUserToDb = async (user: User) => {
  try {
    await dbClient.connect()
    const database = dbClient.db('fleamarket')
    const users = database.collection('users')

    const options: FindOneAndUpdateOptions = {
      upsert: true,
      returnDocument: 'after'
    }
    const filter = { email: user.email }
    // It is like Upsert
    const result = await users.findOneAndUpdate(filter, { $set: user }, options)
    return result
  } catch (err) {
    console.error('Error creating user in DB: ' + +JSON.stringify(err))
  } finally {
    await dbClient.close()
  }
}

export const getSaleItemsFromDb = async () => {
  try {
    await dbClient.connect()
    const database = dbClient.db('fleamarket')
    const sales = database.collection('sales')
    const cursor = sales.find({ status: 'available' })
    const items: Sale[] = []
    console.log('cursor: ' + JSON.stringify(cursor))
    await cursor.forEach(item => {
      console.log('item: ' + JSON.stringify(item))
      items.push(item as unknown as Sale)
    })
    return items
  } catch (err) {
    console.error('Error reading user from DB' + JSON.stringify(err))
  } finally {
    await dbClient.close()
  }
}

export const createOrUpdateSale = async (sale: Sale) => {
  try {
    await dbClient.connect()
    const database = dbClient.db('fleamarket')
    const sales = database.collection<Sale>('sales')

    const options: FindOneAndUpdateOptions = {
      upsert: true,
      returnDocument: 'after'
    }
    const filter = { _id: sale._id }
    // It is like Upsert
    const result = await sales.findOneAndUpdate(filter, { $set: sale }, options)
    return result
  } catch (err) {
    console.error('Error creating sale item in DB: ' + +JSON.stringify(err))
  } finally {
    await dbClient.close()
  }
}

export const deleteSale = async (_id: string) => {
  try {
    await dbClient.connect()
    const database = dbClient.db('fleamarket')
    const sales = database.collection('sales')
    const filter = { _id: new ObjectId(_id) }
    // It is like Upsert
    const result = await sales.deleteOne(filter)
    return result
  } catch (err) {
    console.error('Error creating sale item in DB: ' + +JSON.stringify(err))
  } finally {
    await dbClient.close()
  }
}
