import { ObjectId } from 'mongodb'
import Tags from './data-sources/tags'
import Plants from './data-sources/plants'

export interface UserDocument {
    _id?: ObjectId
    username: string
    password: string
    email: string
}

export interface Context {
    loggedInUser: UserDocument
}

export interface PlantDocument {
    _id?: ObjectId
    name: string
    scientificName: string
    origin: string
    sunshine: string
    watering: string
    substrate: string
    advice: string
    tags?: [Tags]
}

export interface TagDocument {
    _id?: ObjectId
    name: string
}

export interface UserPlantDocument {
    _id?: ObjectId
    plant: Plants
    buyingDate: String
    buyingLocation: String
    price: Number
    giftDate: String
    gifter: String
    lastWatering: String
    lastRepot: String
    personnalPictures: Array<String>
}
