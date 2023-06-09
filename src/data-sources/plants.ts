import { MongoDataSource } from 'apollo-datasource-mongodb'
import { ObjectId } from 'mongodb'
import { PlantDocument } from '../types'
import Tags from './tags'

export class Plants extends MongoDataSource<PlantDocument> {
    getPlants() {
        return this.collection.find().toArray()
    }

    getPlant(plantId: ObjectId) {
        return this.collection.findOne({ _id: new ObjectId(plantId) })
    }

    addPlant(
        name: string,
        scientificName: string,
        origin: string,
        sunshine: string,
        substrate: string,
        watering: string,
        advice: string,
        tags: [Tags]
    ) {
        return this.collection.insertMany([
            {
                name,
                scientificName,
                origin,
                sunshine,
                substrate,
                watering,
                advice,
                tags,
            },
        ])
    }
}
