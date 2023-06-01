import { MongoDataSource } from 'apollo-datasource-mongodb'
import { ObjectId } from 'mongodb'
import { TagDocument } from '../types'

export default class Tags extends MongoDataSource<TagDocument> {
    getTags() {
        return this.collection.find().toArray()
    }

    getTag(tagId: ObjectId) {
        return this.collection.findOne({ _id: new ObjectId(tagId) })
    }

    addTag(name: string) {
        return this.collection.insertMany([{ name }])
    }
}
