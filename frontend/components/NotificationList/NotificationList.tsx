import React from 'react'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import NotificationBadge from './NotificationBadge'

const NotificationsList = () => {
    const { notifications } = useAppContext()
    return (
        <div className="fixed p-4 flex flex-col gap-2 right-0 z-10 top-16">
            {notifications.map((notification) => (
                <NotificationBadge key={notification.id} notif={notification} />
            ))}
        </div>
    )
}

export default NotificationsList
