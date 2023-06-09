import { MongoDataSource } from 'apollo-datasource-mongodb'
import { ObjectId } from 'mongodb'
import { Plants } from './plants'
import { UserPlantDocument } from '../types'

export default class UserPlants extends MongoDataSource<UserPlantDocument> {
    getUserPlants() {
        return this.collection.find().toArray()
    }

    getUserPlant(userPlantId: ObjectId) {
        return this.collection.findOne({ _id: new ObjectId(userPlantId) })
    }

    addUserPlant(
        plant: Plants,
        buyingDate: String,
        buyingLocation: String,
        price: Number,
        giftDate: String,
        gifter: String,
        lastWatering: String,
        lastRepot: String,
        personnalPictures: Array<String>
    ) {
        return this.collection.insertMany([
            {
                plant,
                buyingDate,
                buyingLocation,
                price,
                giftDate,
                gifter,
                lastWatering,
                lastRepot,
                personnalPictures,
            },
        ])
    }
}
