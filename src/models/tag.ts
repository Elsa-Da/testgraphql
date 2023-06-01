import mongoose, { Schema } from 'mongoose'
import { ObjectId } from 'mongodb'

const tagSchema = new Schema({
    _id: ObjectId,
    name: String,
})

export const Tag = mongoose.model('tag', tagSchema)
