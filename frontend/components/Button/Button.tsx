import clsx from 'clsx'
import { FC } from 'react'
import { FaSpinner } from 'react-icons/fa'

type Props = {
    children: string | JSX.Element
    type?: 'submit' | 'button'
    loading?: boolean
    className?: string
    onClick?: () => void
    style?: 'default' | 'link'
    color?: 'primary' | 'secondary' | 'light'
    disabled?: boolean
    disabledText?: string
}

const Button: FC<Props> = (props) => {
    const styles = {
        default: 'font-bold rounded',
        link: 'font-medium enabled:hover:underline',
    }

    const colors = {
        default: {
            primary:
                'bg-blue-500 enabled:hover:bg-blue-700 disabled:bg-slate-400 text-white',
            secondary:
                'bg-slate-500 enabled:hover:bg-slate-700 disabled:bg-slate-400 text-white',
            light: 'bg-white enabled:hover:bg-slate-700 disabled:bg-slate-400 text-gray-500',
        },
        link: {
            primary: 'text-blue-600 dark:text-blue-500 disabled:text-slate-400',
            secondary:
                'text-slate-600 dark:text-slate-500 disabled:test-slate-400',
            light: 'text-white disabled:test-slate-400',
        },
    }

    const btnStyle = styles[props.style || 'default']
    const btnColor = colors[props.style || 'default'][props.color || 'primary']

    return (
        <button
            type={props.type || 'submit'}
            className={clsx(
                'relative flex align-center justify-center gap-2 py-2 px-4',
                btnStyle,
                btnColor,
                props.className
            )}
            disabled={props.loading || props.disabled}
            onClick={props.onClick}
            title={props.disabled ? props.disabledText : ''}
        >
            {props.loading && (
                <div style={{ transform: 'translateY(4px)' }}>
                    <FaSpinner className="animate-spin" />
                </div>
            )}
            {props.children}
        </button>
    )
}

export default Button
