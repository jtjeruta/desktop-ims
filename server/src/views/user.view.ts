import { UserDocument } from 'src/schemas/user.schema'

export const getUsersView = (users: UserDocument[]) => {
    return users.map((user) => getUserView(user))
}

export const getUserView = (user: UserDocument) => {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
    }
}
