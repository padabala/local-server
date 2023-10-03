import { Sale, SaleStatus, User } from '../modals'
import { dbClient } from './dbConnection'
import { FindOneAndUpdateOptions, ObjectId } from 'mongodb'

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
    console.error('Error reading sale items from DB' + JSON.stringify(err))
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

export const syncAndGetAvailableSaleItems = async (saleItems: Sale[]) => {
  try {
    await dbClient.connect()
    const database = dbClient.db('fleamarket')
    const sales = database.collection('sales')

    if (saleItems && saleItems.length > 0) {
      const deletedItems: Sale[] = saleItems.filter(
        item => item.status === SaleStatus.DELETED
      )
      const updatedItems: Sale[] = saleItems.filter(
        item => item.status === SaleStatus.OFFLINE
      )
      if (deletedItems.length > 0) {
        deletedItems.forEach(async item => {
          const filter = { _id: new ObjectId(item._id) }
          const result = await sales.deleteOne(filter)
        })
      }
      if (updatedItems.length > 0) {
        const options: FindOneAndUpdateOptions = {
          upsert: true,
          returnDocument: 'after'
        }
        updatedItems.forEach(async item => {
          item.status = SaleStatus.AVAILABLE
          if (!item._id) {
            item._id = new ObjectId()
          } else {
            item._id = new ObjectId(item._id)
          }
          const filter = {
            _id: item._id
          }
          // It is like Upsert
          const result = await sales.findOneAndUpdate(
            filter,
            {
              $set: item
            },
            options
          )
        })
      }
    }
    // It is like Upsert
    const items: Sale[] = []
    const cursor = sales.find({ status: 'available' })
    console.log('cursor: ' + JSON.stringify(cursor))
    await cursor.forEach(item => {
      console.log('item: ' + JSON.stringify(item))
      items.push(item as unknown as Sale)
    })
    return items
  } catch (err) {
    console.error('Error creating sale item in DB: ' + +JSON.stringify(err))
  } finally {
    await dbClient.close()
  }
}
