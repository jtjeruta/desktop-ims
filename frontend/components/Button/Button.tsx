import clsx from 'clsx'
import { FC } from 'react'
import { FaSpinner } from 'react-icons/fa'

type Props = {
    children?: React.ReactNode
    type?: 'submit' | 'button'
    loading?: boolean
    className?: string
    onClick?: () => void
    style?: 'default' | 'link' | 'outline'
    color?: 'primary' | 'secondary' | 'light'
    disabled?: boolean
    disabledText?: string
}

const Button: FC<Props> = (props) => {
    const styles = {
        default: 'font-bold rounded',
        link: 'font-medium enabled:hover:underline',
        outline: 'font-medium rouded',
    }

    const colors = {
        default: {
            primary:
                'bg-blue-500 enabled:hover:bg-blue-700 disabled:bg-slate-400 text-white',
            secondary:
                'bg-slate-500 enabled:hover:bg-slate-700 disabled:bg-slate-400 text-white',
            light: 'bg-white enabled:hover:bg-slate-700 disabled:bg-slate-400 text-gray-500 enabled:hover:text-white',
        },
        link: {
            primary: 'text-blue-600 disabled:text-slate-400',
            secondary: 'text-slate-600 disabled:text-slate-400',
            light: 'text-white disabled:text-slate-400',
        },
        outline: {
            primary:
                'bg-blue-500 enabled:hover:bg-blue-700 disabled:bg-slate-400 text-white',
            secondary:
                'text-slate-600 disabled:text-slate-400 border enabled:hover:bg-slate-100',
            light: 'bg-white enabled:hover:bg-slate-700 disabled:bg-slate-400 text-gray-500 enabled:hover:text-white',
        },
    }

    const btnStyle = styles[props.style || 'default']
    const btnColor = colors[props.style || 'default'][props.color || 'primary']

    return (
        <button
            type={props.type || 'submit'}
            className={clsx(
                'relative flex items-center justify-center gap-2 py-2 px-4',
                btnStyle,
                btnColor,
                props.className
            )}
            disabled={props.loading || props.disabled}
            onClick={props.onClick}
            title={props.disabled ? props.disabledText : ''}
        >
            {props.loading && <FaSpinner className="animate-spin" />}
            {props.children}
        </button>
    )
}

export default Button
