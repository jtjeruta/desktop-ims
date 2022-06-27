import clsx from 'clsx'
import { FC } from 'react'
import { FaSpinner } from 'react-icons/fa'

type Props = {
    children: string | JSX.Element
    type?: 'submit' | 'button'
    loading?: boolean
    className?: string
    onClick?: () => void
} & (
    | {
          style?: 'default'
          color?: 'primary'
      }
    | {
          style: 'link'
          color?: 'primary'
      }
)

const Button: FC<Props> = (props) => {
    const styles = {
        default: 'font-bold rounded',
        link: 'font-medium hover:underline',
    }

    const colors = {
        'default-primary':
            'bg-blue-500 hover:bg-blue-700 disabled:bg-blue-700 text-white',
        'link-primary': 'text-blue-600 dark:text-blue-500 ',
    }

    const btnStyle = styles[props.style || 'default']
    const btnColor =
        colors[`${props.style || 'default'}-${props.color || 'primary'}`]

    return (
        <button
            type={props.type || 'submit'}
            className={clsx(
                'relative flex align-center justify-center gap-2 py-2 px-4 ',
                btnStyle,
                btnColor,
                props.className
            )}
            disabled={props.loading}
            onClick={props.onClick}
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
