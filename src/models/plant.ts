import mongoose, { Schema, mongo } from 'mongoose'
import { ObjectId } from 'mongodb'

const plantSchema = new Schema({
    _id: ObjectId,
    name: String,
    scientificName: String,
    origin: String,
    sunshine: String,
    watering: String,
    substrate: String,
    advice: String,
    tags: String,
})

export const Plant = mongoose.model('plant', plantSchema)
