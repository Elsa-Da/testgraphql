import mongoose, { ObjectId } from 'mongoose'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { GraphQLError } from 'graphql'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { User as UserModel } from './models/user.js'
import { Plant as PlantModel } from './models/plant.js'
import { Tag as TagModel } from './models/tag.js'
import { UserPlant as UserPlantModel } from './models/user-plant.js'
import Users from './data-sources/users.js'
import pkg from 'body-parser'
import {
    PlantDocument,
    TagDocument,
    UserDocument,
    UserPlantDocument,
} from './types.js'
import { Plants } from './data-sources/plants.js'
import Tags from './data-sources/tags.js'
import UserPlants from './data-sources/user-plants.js'
const { json } = pkg

await mongoose.connect('mongodb://127.0.0.1:27017/ragnemt')

const app = express()
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app)

const typeDefs = `#graphql
  type User {
    _id: ID!
    username: String
    password: String
    email: String
  }
  type Tag {
    _id: ID!
    name: String
  }

  input TagInput {
    name:String
  }

  
  type Plant {
    _id: ID!
    name: String!
    scientificName: String!
    origin: String!
    sunshine: String!
    watering: String!
    substrate: String!
    advice: String!
    tags: [Tag!]!
  }

  type UserPlant {
        plant: Plants,
        buyingDate: String,
        buyingLocation: String,
        price: Number,
        giftDate: String,
        gifter: String,
        lastWatering: String,
        lastRepot: String,
        personnalPictures: Array<String>
  }

  type Query {
    users: [User]
    user(_id: ID!): User
    plants: [Plant]
    plant(_id: ID!): Plant
    tags: [Tag]
    tag(_id: ID!) : Tag
    userPlants: [userPlant]
    userPlant(_id: ID!) : UserPlant
  }

  type Mutation {
    addUser(username: String, password: String, email: String): User
    addPlant(name: String,
        scientificName: String,
        origin: String,
        sunshine: String,
        substrate: String,
        watering: String,
        advice: String,
        tags: [TagInput]) : Plant
    addTag(name: String) : Tag
    addUserPlant(plant: Plants,
        buyingDate: String,
        buyingLocation: String,
        price: Number,
        giftDate: String,
        gifter: String,
        lastWatering: String,
        lastRepot: String,
        personnalPictures: Array<String>
    ) : UserPlant
  }
`

const resolvers = {
    Query: {
        users: (_parent: any, _args: any, { datas }) => {
            return datas.users.getUsers()
        },
        user: (_parent: any, { _id }, { datas }) => {
            return datas.users.getUser(_id).then((res: UserDocument) => {
                if (!res) {
                    throw new GraphQLError(
                        `User with User Id ${_id} does not exist.`
                    )
                }
                return res
            })
        },
        tags: (_parent: any, _args: any, { datas }) => {
            return datas.tags.getTags()
        },
        tag: (_parent: any, { _id }, { datas }) => {
            return datas.tags.getTag(_id).then((res: TagDocument) => {
                if (!res) {
                    // throw new GraphQLError(
                    //     `Tag with User Id ${_id} does not exist.`
                    // )
                }
                return res
            })
        },
        plants: (_parent: any, _args: any, { datas }) => {
            return datas.plants.getPlants()
        },
        plant: (_parent: any, { _id }, { datas }) => {
            return datas.plants.getPlant(_id).then((res: PlantDocument) => {
                if (!res) {
                    throw new GraphQLError(
                        `Plant with Plant Id ${_id} does not exist.`
                    )
                }
                return res
            })
        },
        userPlants: (_parent: any, _args: any, { datas }) => {
            return datas.userPlants.getUserPlants()
        },
        userPlant: (_parent: any, { _id }, { datas }) => {
            return datas.userPlants
                .getUserPlant(_id)
                .then((res: UserPlantDocument) => {
                    if (!res) {
                        throw new GraphQLError(
                            `User Plant with User Plant Id ${_id} does not exist.`
                        )
                    }
                    return res
                })
        },
    },
    Mutation: {
        addUser: (_parent: any, { username, password, email }, { datas }) => {
            return datas.users
                .addUser(username, password, email)
                .then((res: { insertedIds: ObjectId[] }) => ({
                    _id: res.insertedIds[0],
                    username,
                    password,
                    email,
                }))
        },
        addPlant: (
            _parent: any,
            {
                name,
                scientificName,
                origin,
                substrate,
                sunshine,
                watering,
                advice,
                tags,
            },
            { datas }
        ) => {
            return datas.plants
                .addPlant(
                    name,
                    scientificName,
                    origin,
                    substrate,
                    sunshine,
                    watering,
                    advice,
                    tags
                )
                .then((res: { insertedIds: ObjectId[] }) => ({
                    _id: res.insertedIds[0],
                    name,
                    scientificName,
                    origin,
                    substrate,
                    sunshine,
                    watering,
                    advice,
                    tags,
                }))
        },
        addUserPlant: (
            _parent: any,
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
            { datas }
        ) => {
            return datas.userPlants
                .addUserPlant(
                    plant,
                    buyingDate,
                    buyingLocation,
                    price,
                    giftDate,
                    gifter,
                    lastWatering,
                    lastRepot,
                    personnalPictures
                )
                .then((res: { insertedIds: ObjectId[] }) => ({
                    _id: res.insertedIds[0],
                    plant,
                    buyingDate,
                    buyingLocation,
                    price,
                    giftDate,
                    gifter,
                    lastWatering,
                    lastRepot,
                    personnalPictures,
                }))
        },
        addTag: (_parent: any, { name }, { datas }) => {
            return datas.tags
                .addTag(name)
                .then((res: { insertedIds: ObjectId[] }) => ({
                    _id: res.insertedIds[0],
                    name,
                }))
        },
    },
}

interface MyContext {
    dataSources?: {
        users: Users
        plants: Plants
        tags: Tags
        userPlants: UserPlants
    }
}

const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
})
await server.start()

app.use(
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
        context: async ({ req }) => ({
            token: req.headers.token,
            datas: {
                users: new Users(await UserModel.createCollection()),
                plants: new Plants(await PlantModel.createCollection()),
                tags: new Tags(await TagModel.createCollection()),
                userPlants: new UserPlants(
                    await UserPlantModel.createCollection()
                ),
            },
        }),
    })
)

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000`)
)
