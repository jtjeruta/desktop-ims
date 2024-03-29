export type User = {
    id: string
    firstName: string
    lastName: string
    role: 'admin' | 'employee'
    email: string
    username: string
}

export type CreateUpdateUserDoc = {
    firstName: string
    lastName: string
    role: 'admin' | 'employee'
    email: string
    username: string
}

export type CreateUpdateUserErrors = {
    firstName?: { message: string }
    lastName?: { message: string }
    role?: { message: string }
    email?: { message: string }
    username?: { message: string }
}

export type CreateUser = (
    user: CreateUpdateUserDoc
) => Promise<
    [true, User] | [false, { message: string; errors?: CreateUpdateUserErrors }]
>

export type UpdateUser = (
    id: string,
    user: CreateUpdateUserDoc
) => Promise<
    [true, User] | [false, { message: string; errors?: CreateUpdateUserErrors }]
>
export type RemoveUser = (id: User['id']) => void
export type ListUsers = () => Promise<[true, User[]] | [false, string]>
export type ChangePassword = (
    userId: string,
    password: string
) => Promise<[true] | [false, { errors?: { password?: { message: string } } }]>

export type Context = {
    users: User[] | null
    createUser: CreateUser
    updateUser: UpdateUser
    removeUser: RemoveUser
    listUsers: ListUsers
    userToEdit: User | null
    setUserToEdit: (user: User | null) => void
    userToDelete: User | null
    setUserToDelete: (user: User | null) => void
    changePassword: ChangePassword
}
