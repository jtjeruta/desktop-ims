export type Notification = {
    id: string
    type: 'success' | 'danger'
    title: string
    body?: string
}

export type AddNotifDoc = {
    type: 'success' | 'danger'
    title: string
    body?: string
}

export type AddNotification = (notif: AddNotifDoc) => void
export type RemoveNotification = (id: string) => void
export type AddLoading = (key: string) => void
export type RemoveLoading = (key: string) => void
export type IsLoading = (key: string) => boolean
export type OpenDialog = (key: string) => void
export type CloseDialog = () => void
export type DialogIsOpen = (key: string) => boolean

export type Context = {
    notifications: Notification[]
    addNotification: AddNotification
    removeNotification: RemoveNotification
    addLoading: AddLoading
    removeLoading: RemoveLoading
    isLoading: IsLoading
    openDialog: OpenDialog
    closeDialog: CloseDialog
    dialogIsOpen: DialogIsOpen
    sidebarOpen: boolean
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}
