export type Notification = {
    id: string
    type: 'primary' | 'success' | 'danger'
    title: string
    body?: string
}

export type AddNotifDoc = {
    type: 'primary' | 'success' | 'danger'
    title: string
    body?: string
}

export type AddNotification = (notif: AddNotifDoc) => void
export type RemoveNotification = (id: string) => void
export type AddLoading = (key: string) => void
export type RemoveLoading = (key: string) => void
export type IsLoading = (key: string) => boolean
export type Context = {
    notifications: Notification[]
    addNotification: AddNotification
    removeNotification: RemoveNotification
    addLoading: AddLoading
    removeLoading: RemoveLoading
    isLoading: IsLoading
}
