import clsx from 'clsx'
import { FC } from 'react'
import { BsInfoCircle } from 'react-icons/bs'

type Props = {
    title?: string
    content?: React.ReactNode
    type: 'info' | 'warning'
    className?: string
    onClick?: () => void
}

const Alert: FC<Props> = (props) => {
    const style = {
        info: 'bg-sky-100 border-sky-500 text-sky-900',
        warning: 'bg-orange-100 border-orange-500 text-orange-900',
    }

    return (
        <div
            className={clsx(
                'border-t-4 rounded-b px-4 py-3 shadow-md',
                style[props.type],
                props.className,
                props.onClick && 'cursor-pointer'
            )}
            onClick={props.onClick}
            role="alert"
        >
            <div className="flex items-center">
                <div className="py-1 pr-2">
                    <BsInfoCircle fontSize={20} />
                </div>
                <div>
                    {props.title && (
                        <p className="font-bold text-sm">{props.title}</p>
                    )}
                    {props.content && (
                        <div className="text-sm">{props.content}</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Alert
