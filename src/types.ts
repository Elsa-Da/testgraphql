import { ObjectId } from 'mongodb'

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
    tags?: string
}

export interface TagDocument {
    _id?: ObjectId
    name: string
}
