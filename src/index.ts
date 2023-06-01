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
import Users from './dataSources/users.js'
import pkg from 'body-parser'
import { PlantDocument, TagDocument, UserDocument } from './types.js'
import Plants from './dataSources/plants.js'
import Tags from './dataSources/tags.js'
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
  type Plant {
    _id: ID!
    name: String!
    scientificName: String!
    origin: String!
    sunshine: String!
    watering: String!
    substrate: String!
    advice: String!
    tags: String
  }
  type Query {
    users: [User]
    user(_id: ID!): User
    plants: [Plant]
    plant(_id: ID!): Plant
    tags: [Tag]
    tag(_id: ID!) : Tag
  }
  type Mutation {
    addUser(username: String, password: String, email: String): User
    addPlant(name: String,
        scientificName: String,
        origin: String,
        sunshine: String,
        substrate: String,
        watering: String,
        advice: String) : Plant
    addTag(name: String) : Tag
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
                    advice
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
            },
        }),
    })
)

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000`)
)
