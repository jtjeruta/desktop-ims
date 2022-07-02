import { FC } from 'react'
import clsx from 'clsx'

type Props = {
    title?: string
    children: JSX.Element
    className?: string
    bodyProps?: {
        className?: string
    }
}

const Card: FC<Props> = (props) => (
    <div
        className={clsx(
            'bg-white overflow-x-auto shadow-md sm:rounded-lg',
            'text-sm text-left text-gray-500 dark:text-gray-400',
            props.className
        )}
    >
        {props.title && (
            <div
                className={clsx(
                    'px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left',
                    'text-gray-500 uppercase border-b border-gray-200 bg-gray-50'
                )}
            >
                {props.title}
            </div>
        )}
        <div className={clsx('p-4', props.bodyProps?.className)}>
            {props.children}
        </div>
    </div>
)

export default Card
