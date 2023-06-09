import mongoose, { Schema } from 'mongoose'
import { ObjectId } from 'mongodb'
import Tags from '../data-sources/tags'

const plantSchema = new Schema({
    _id: ObjectId,
    name: String,
    scientificName: String,
    origin: String,
    sunshine: String,
    watering: String,
    substrate: String,
    advice: String,
    tags: Array<Tags>,
})

export const Plant = mongoose.model('plant', plantSchema)
