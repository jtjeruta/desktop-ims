export type User = {
    id: string
    firstName: string
    lastName: string
    role: 'admin' | 'employee'
    email: string
}

export type CreateUserDoc = {
    firstName: string
    lastName: string
    role: 'admin' | 'employee'
    email: string
}

export type AddUser = (user: CreateUserDoc) => void
export type RemoveUser = (id: User['id']) => void
export type ListUsers = () => void

export type Context = {
    users: User[] | null
    addUser: AddUser
    removeUser: RemoveUser
    listUsers: ListUsers
}
