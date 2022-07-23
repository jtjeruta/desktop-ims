import clsx from 'clsx'
import { FC } from 'react'
import { BsInfoCircle } from 'react-icons/bs'

type Props = {
    title?: string
    content?: string | JSX.Element
    type: 'info'
    className?: string
}

const Alert: FC<Props> = (props) => {
    const style = {
        info: 'bg-teal-100 border-teal-500 text-teal-900',
    }

    return (
        <div
            className={clsx(
                'border-t-4 rounded-b px-4 py-3 shadow-md',
                style[props.type],
                props.className
            )}
            role="alert"
        >
            <div className="flex">
                <div className="py-1 pr-2">
                    <BsInfoCircle fontSize={20} />
                </div>
                <div>
                    {props.title && <p className="font-bold">{props.title}</p>}
                    {props.content && (
                        <p className="text-sm">{props.content}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Alert
