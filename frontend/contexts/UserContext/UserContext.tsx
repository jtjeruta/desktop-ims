import React, { useState } from 'react'
import { AddUser, RemoveUser, Context, User } from './types'

const UserContext = React.createContext<Context | any>({})

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [users, setUsers] = useState<User[]>([])

    const addUser: AddUser = (createUserDoc) => {
        // Call api here
    }

    const removeUser: RemoveUser = (id) => {
        // Call api here
    }

    const value: Context = {
        users,
        addUser,
        removeUser,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const useUserContext = () => React.useContext<Context>(UserContext)

export { UserContext, UserContextProvider, useUserContext }
