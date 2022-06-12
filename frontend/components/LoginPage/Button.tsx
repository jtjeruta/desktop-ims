import { FC } from 'react'
import clsx from 'clsx'
import { FaSpinner } from 'react-icons/fa'

type Props = {
    loading?: boolean
    type?: 'submit' | 'button'
    onClick?: () => void
    children: string
}

const Button: FC<Props> = ({ loading, type, onClick, children }) => {
    return (
        <button
            type={type || 'submit'}
            className={clsx(
                'w-full py-2 rounded-full',
                'flex align-center justify-center relative',
                ' bg-green-600 text-gray-100 focus:outline-none',
                'disabled:opacity-60'
            )}
            disabled={loading}
            onClick={onClick}
        >
            {loading && (
                <FaSpinner className="animate-spin absolute mr-20 mt-1" />
            )}
            {children}
        </button>
    )
}

export default Button
