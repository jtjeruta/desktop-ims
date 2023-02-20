import clsx from 'clsx'
import React, { FC, useCallback, useLayoutEffect } from 'react'
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

    useLayoutEffect(() => {
        timeout = setTimeout(() => closeNotif(), 4000)
    }, [closeNotif])

    const borderColor: Record<Notification['type'], string> = {
        success: 'border-green-500',
        danger: 'border-red-500',
    }

    const textColor: Record<Notification['type'], string> = {
        success: 'text-green-800',
        danger: 'text-red-800',
    }

    return (
        <div
            className={clsx(
                'rounded px-4 py-3 shadow-md animate-wiggle pointer-events-auto z-20',
                'bg-white w-full md:w-80 border',
                borderColor[notif.type],
                textColor[notif.type]
            )}
            role="alert"
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
