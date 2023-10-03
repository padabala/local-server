import express, { Request, Response } from 'express'
import { Sale, SaleStatus } from '../modals'
import { ObjectId } from 'mongodb'
import {
  createOrUpdateSale,
  deleteSale,
  getSaleItemsFromDb,
  syncAndGetAvailableSaleItems
} from '../services'

export const salesRouter = express.Router()

salesRouter.use(express.json())

salesRouter.post('/sales/sync', async (_req: Request, res: Response) => {
  console.log('request data: ' + JSON.stringify(_req.body))
  const syncPendingItems: Sale[] = _req.body
  try {
    const saleItems = await syncAndGetAvailableSaleItems(syncPendingItems)
    res.status(200).send(saleItems ?? [])
  } catch (error) {
    res.status(500).send(error)
  }
})

salesRouter.post('/sales/delete', async (_req: Request, res: Response) => {
  try {
    const deleteId = _req.body._id
    const deletedResult = await deleteSale(deleteId)
    console.log('Deleted Result: ' + JSON.stringify(deletedResult))
    res.status(200).send(deleteId)
  } catch (error) {
    res.status(500).send(error)
  }
})

salesRouter.post('/sales/create', async (_req: Request, res: Response) => {
  try {
    console.log('create sale' + JSON.stringify(_req.body))
    const isNewItem = _req.body._id === '' || _req.body._id.length > 24
    const sale: Sale = {
      _id: isNewItem ? new ObjectId() : new ObjectId(_req.body._id),
      description: _req.body.description,
      createdDateTime: _req.body.createdDateTime,
      updatedDateTime: _req.body.updatedDateTime ?? _req.body.createdDateTime,
      category: _req.body.category,
      originalPrice: _req.body.originalPrice,
      updatedPrice: _req.body.updatedPrice ?? _req.body.originalPrice,
      user: _req.body.user,
      imageUrl:
        'https://raw.githubusercontent.com/padabala/local-server/587f83e186aa478be0e9211ed29999f59750a4cc/src/assets/car-tyres.jpeg',
      status: SaleStatus.AVAILABLE
    }
    const createdSale = await createOrUpdateSale(sale)
    if (createdSale) {
      res.status(200).send(sale)
    } else {
      res.status(402).send('Error creating')
    }
  } catch (error) {
    res.status(500).send(error)
  }
})
