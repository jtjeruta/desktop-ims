import React from 'react'
import clsx from 'clsx'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import NotificationBadge from './NotificationBadge'

const NotificationsList = () => {
    const { notifications } = useAppContext()

    return notifications.length <= 0 ? null : (
        <div
            className={clsx([
                'absolute p-4 flex flex-col gap-2 pointer-events-none items-center',
                'left-0 right-0 bottom-0 md:!bottom-auto md:top-10',
            ])}
        >
            {notifications.map((notification) => (
                <NotificationBadge key={notification.id} notif={notification} />
            ))}
        </div>
    )
}

export default NotificationsList
