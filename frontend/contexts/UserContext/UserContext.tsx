import React, { useMemo, useState } from 'react'
import * as UsersAPI from '../../apis/UserAPI'
import { useAppContext } from '../AppContext/AppContext'
import { AddUser, RemoveUser, Context, User, ListUsers } from './types'

const UserContext = React.createContext<Context | any>({})

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [users, setUsers] = useState<User[] | null>(null)

    const addUser: AddUser = (createUserDoc) => {
        // Call api here
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
            addUser,
            removeUser,
            listUsers,
        }),
        [users]
    )

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const useUserContext = () => React.useContext<Context>(UserContext)

export { UserContext, UserContextProvider, useUserContext }
