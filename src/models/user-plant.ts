import mongoose, { Schema } from 'mongoose'
import { ObjectId } from 'mongodb'
import { Plants } from '../data-sources/plants'

const userPlantSchema = new Schema({
    _id: ObjectId,
    plant: { type: Plants },
    buyingDate: String,
    buyingLocation: String,
    price: Number,
    giftDate: String,
    gifter: String,
    lastWatering: String,
    lastRepot: String,
    personnalPictures: Array<String>,
})

export const UserPlant = mongoose.model('userPlant', userPlantSchema)
