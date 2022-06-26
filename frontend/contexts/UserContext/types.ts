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

export type CreateUserErrors = {
    firstName?: { message: string }
    lastName?: { message: string }
    role?: { message: string }
    email?: { message: string }
}

export type AddUser = (
    user: CreateUserDoc
) => Promise<
    [true, User] | [false, { message: string; errors?: CreateUserErrors }]
>
export type RemoveUser = (id: User['id']) => void
export type ListUsers = () => Promise<void>

export type Context = {
    users: User[] | null
    addUser: AddUser
    removeUser: RemoveUser
    listUsers: ListUsers
}
