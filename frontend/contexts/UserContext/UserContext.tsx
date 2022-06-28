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
} from './types'

const UserContext = React.createContext<Context | any>({})

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()
    const [users, setUsers] = useState<User[] | null>(null)
    const [userToEdit, setUserToEdit] = useState<User | null>(null)

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

        // update auth detials
        if (id === AuthContext.user?.id) {
            AuthContext.setUser(response[1])
        }

        return [true, response[1]]
    }

    const removeUser: RemoveUser = (id) => {
        // Call api here
    }

    const listUsers: ListUsers = async () => {
        const key = 'list-users'

        AppContext.addLoading(key)
        const response = await UsersAPI.listUsers()
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return
        }

        setUsers(response[1])
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
        }),
        [users, userToEdit]
    )

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const useUserContext = () => React.useContext<Context>(UserContext)

export { UserContext, UserContextProvider, useUserContext }
