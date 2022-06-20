import React, { useMemo } from 'react'
import { v4 as uuid } from 'uuid'
import {
    AddLoading,
    AddNotification,
    Context,
    IsLoading,
    Notification,
    RemoveLoading,
    RemoveNotification,
} from './types'

const AppContext = React.createContext<Context | any>({})

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [notifications, setNotifications] = React.useState<Notification[]>([])
    const [loading, setLoading] = React.useState<string[]>([])

    const addNotification: AddNotification = ({ type, title, body }) => {
        setNotifications((prev) => [...prev, { id: uuid(), type, title, body }])
    }

    const removeNotification: RemoveNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    }

    const addLoading: AddLoading = (key) => {
        setLoading((prev) => [...prev, key])
    }

    const removeLoading: RemoveLoading = (key) => {
        setLoading((prev) => prev.filter((k) => k !== key))
    }

    const isLoading: IsLoading = (key) => {
        return loading.includes(key)
    }

    const value: Context = useMemo(
        () => ({
            notifications,
            addNotification,
            removeNotification,
            addLoading,
            removeLoading,
            isLoading,
        }),
        [notifications, loading]
    )

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

const useAppContext = () => React.useContext<Context>(AppContext)

export { AppContext, AppContextProvider, useAppContext }
