import React from 'react'
import clsx from 'clsx'
import { IconType } from 'react-icons/lib'
import Button from '../Button/Button'
import { FaPlus } from 'react-icons/fa'

interface ActionButtonProps {
    icon?: IconType
    onClick: () => void
}

export const ActionButton = (props: ActionButtonProps) => {
    return (
        <div
            className={clsx(
                'fixed top-0 bottom-0 left-0 right-0 pointer-events-none p-6',
                'flex items-end justify-end md:hidden'
            )}
        >
            <Button
                color="primary"
                onClick={props.onClick}
                className="pointer-events-auto rounded-full !py-5 !px-5"
            >
                {props.icon ? <props.icon /> : <FaPlus />}
            </Button>
        </div>
    )
}
