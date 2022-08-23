import React, { FC, useCallback, useEffect } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { Notification } from '../../contexts/AppContext/types'

let timeout: NodeJS.Timeout | null = null

type Props = {
    notif: Notification
}

const NotificationBadge: FC<Props> = ({ notif }) => {
    const { removeNotification } = useAppContext()

    const closeNotif = useCallback(() => {
        timeout && clearTimeout(timeout)
        removeNotification(notif.id)
    }, [notif.id, removeNotification])

    useEffect(() => {
        timeout = setTimeout(() => closeNotif(), 4000)
    }, [closeNotif])

    return (
        <div
            className="rounded-b px-4 py-3 shadow-md animate-wiggle bg-white"
            role="alert"
            style={{ width: 300 }}
        >
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <div className="py-1">
                        <FaCheckCircle />
                    </div>
                    <div>
                        <p className="font-bold">{notif.title}</p>
                        {notif.body && <p className="text-sm">{notif.body}</p>}
                    </div>
                </div>

                <button type="button" onClick={closeNotif}>
                    &times;
                </button>
            </div>
        </div>
    )
}
export default NotificationBadge
