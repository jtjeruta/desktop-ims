import { ObjectId } from 'mongoose'

export type MongoUser = {
    _id: ObjectId
    firstName: string
    lastName: string
    password: string
}
