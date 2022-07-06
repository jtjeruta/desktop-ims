import { FC } from 'react'
import clsx from 'clsx'
import { FaSpinner } from 'react-icons/fa'

type Props = {
    toggled: boolean
    toggledText: string
    unToggledText: string
    loading?: boolean
    textPosition?: 'left' | 'right'
    onClick?: () => void
}

const Switch: FC<Props> = (props) => {
    return (
        <label
            className={clsx(
                'flex items-center cursor-pointer gap-2',
                props.textPosition === 'right' && 'flex-row-reverse'
            )}
        >
            <div className="text-gray-700 font-medium">
                {!props.loading ? (
                    props.toggled ? (
                        props.toggledText
                    ) : (
                        props.unToggledText
                    )
                ) : (
                    <FaSpinner className="animate-spin" />
                )}
            </div>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    onClick={props.onClick}
                    disabled={props.loading}
                />
                <div
                    className={clsx(
                        'block w-11 h-6 rounded-full',
                        !props.toggled ? 'bg-slate-200' : 'bg-blue-500'
                    )}
                ></div>
                <div
                    className={clsx(
                        'absolute left-[3px] top-1 bg-white w-4 h-4 rounded-full transition',
                        props.toggled && 'translate-x-[23px]'
                    )}
                ></div>
            </div>
        </label>
    )
}

export default Switch
