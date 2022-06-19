import clsx from 'clsx'
import { FC } from 'react'
import { FaSpinner } from 'react-icons/fa'

type Props = {
    children: string | JSX.Element
    type?: 'submit' | 'button'
    color?: 'primary' | 'link'
    loading: boolean
    className?: string
    onClick?: () => void
}

const Button: FC<Props> = (props) => {
    const classes = {
        primary:
            'bg-blue-500 hover:bg-blue-700 disabled:bg-blue-700 text-white font-bold py-2 px-4 rounded',
        link: 'font-medium text-blue-600 dark:text-blue-500 hover:underline',
    }

    const btnClass = classes[props.color || 'primary']

    return (
        <button
            type={props.type || 'submit'}
            className={clsx(
                'relative flex justify-center',
                btnClass,
                props.className
            )}
            disabled={props.loading}
            onClick={props.onClick}
        >
            {props.loading && (
                <div
                    className="absolute"
                    style={{ transform: 'translate(-35px, 4px)' }}
                >
                    <FaSpinner className="animate-spin" />
                </div>
            )}
            {props.children}
        </button>
    )
}

export default Button
