import { MongoUser } from 'src/types/mongo-user'

export const getUsersView = (users: MongoUser[]) => {
    return users.map((user) => getUserView(user))
}

export const getUserView = (user: MongoUser) => {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
    }
}
