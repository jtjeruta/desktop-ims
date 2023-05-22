import React, { useMemo, useState } from 'react'
import * as UsersAPI from '../../apis/UserAPI'
import { useAppContext } from '../AppContext/AppContext'
import { useAuthContext } from '../AuthContext/AuthContext'
import {
    CreateUser,
    RemoveUser,
    Context,
    User,
    ListUsers,
    UpdateUser,
    ChangePassword,
} from './types'

const UserContext = React.createContext<Context | any>({})

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()
    const [users, setUsers] = useState<User[] | null>(null)
    const [userToEdit, setUserToEdit] = useState<User | null>(null)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)

    const createUser: CreateUser = async (userDoc) => {
        const key = 'add-user'

        AppContext.addLoading(key)
        const response = await UsersAPI.createUser(userDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        setUsers((prev) => [...(prev || []), response[1]])
        return [true, response[1]]
    }

    const updateUser: UpdateUser = async (id, userDoc) => {
        const key = 'update-user'

        AppContext.addLoading(key)
        const response = await UsersAPI.updateUser(id, userDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        // update users
        setUsers((prev) =>
            (prev || []).map((user) => {
                if (user.id !== id) return user
                return response[1]
            })
        )

        // update auth details
        if (id === AuthContext.user?.id) {
            AuthContext.setUser(response[1])
        }

        return [true, response[1]]
    }

    const changePassword: ChangePassword = async (userId, newPassword) => {
        const key = 'update-user'

        AppContext.addLoading(key)
        const response = await UsersAPI.changePassword(userId, newPassword)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        return response
    }

    const removeUser: RemoveUser = async (id) => {
        const key = 'remove-user'

        AppContext.addLoading(key)
        const response = await UsersAPI.deleteUser(id)
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })

            return [false, response[1].data]
        }

        // update users
        setUsers((prev) => prev?.filter((user) => user.id !== id) || [])

        return [true]
    }

    const listUsers: ListUsers = async () => {
        const key = 'list-users'

        AppContext.addLoading(key)
        const response = await UsersAPI.listUsers()
        AppContext.removeLoading(key)

        if (!response[0]) return response

        setUsers(response[1])
        return response
    }

    const value: Context = useMemo(
        () => ({
            users,
            createUser,
            updateUser,
            removeUser,
            listUsers,
            userToEdit,
            setUserToEdit,
            userToDelete,
            setUserToDelete,
            changePassword,
        }),
        [users, userToEdit, userToDelete]
    )

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const useUserContext = () => React.useContext<Context>(UserContext)

export { UserContext, UserContextProvider, useUserContext }
