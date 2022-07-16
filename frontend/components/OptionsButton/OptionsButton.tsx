import { FC, useRef, useState } from 'react'
import clsx from 'clsx'
import { FaEllipsisV } from 'react-icons/fa'
import Button from '../Button/Button'

type Props = {
    options: {
        label: string
        // eslint-disable-next-line
        onClick: (props: any) => void
    }[]
}

const OptionsButton: FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement>(null)

    return (
        <div className="relative">
            <Button
                style="link"
                color="secondary"
                onClick={() => {
                    ref.current?.focus()
                    setOpen(true)
                }}
            >
                <FaEllipsisV />
            </Button>

            <div
                onBlur={() => setOpen(false)}
                className={clsx(
                    'absolute rounded-lg shadow-lg select-none bg-white z-10 w-min',
                    'right-0',
                    !open && 'opacity-0 pointer-events-none'
                )}
                tabIndex={-1}
                ref={ref}
            >
                <ul>
                    {props.options.map((option, i, arr) => {
                        let className = 'px-4 hover:bg-gray-100 cursor-pointer '

                        if (i === 0 && arr.length === 1)
                            className += 'py-2 rounded-lg'
                        else if (i === 0) className += 'pt-2 pb-1 rounded-t-lg'
                        else if (i === arr.length)
                            className += 'pt-1 pb-2 rounded-b-lg'
                        else className += 'py-1'

                        return (
                            <li
                                key={option.label}
                                className={className}
                                onClick={() => option.onClick(option)}
                            >
                                {option.label}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default OptionsButton
