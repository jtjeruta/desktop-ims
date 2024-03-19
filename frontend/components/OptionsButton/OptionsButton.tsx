import { FC, useRef, useState } from 'react'
import clsx from 'clsx'
import { FaEllipsisV } from 'react-icons/fa'
import Button from '../Button/Button'
import { IconType } from 'react-icons/lib'

type Props = {
    options: {
        icon?: IconType
        label: string
        // eslint-disable-next-line
        onClick: (props: any) => void
    }[]
}

const OptionsButton: FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false)
    const [buttonPosition, setButtonPosition] = useState<{
        top: number
        left: number
    }>({ top: 0, left: 0 })
    const buttonRef = useRef<HTMLButtonElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)

    function updateButtonPosition() {
        if (!buttonRef.current || !popupRef.current) return
        const buttonRect = buttonRef.current.getBoundingClientRect()
        const popupRect = popupRef.current.getBoundingClientRect()

        setButtonPosition({
            top: buttonRect.top - popupRect.height,
            left: buttonRect.left - popupRect.width,
        })
    }

    return (
        <div>
            <Button
                style="link"
                color="secondary"
                onClick={() => {
                    updateButtonPosition()
                    popupRef.current?.focus()
                    setOpen(true)
                }}
                buttonRef={buttonRef}
            >
                <FaEllipsisV />
            </Button>

            <div
                onBlur={() => setOpen(false)}
                className={clsx(
                    'absolute rounded-lg shadow-lg select-none bg-white z-10 w-min',
                    !open && 'opacity-0 pointer-events-none'
                )}
                tabIndex={-1}
                ref={popupRef}
                style={{
                    top: buttonPosition.top,
                    left: buttonPosition.left,
                }}
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
                                <div className="flex gap-1">
                                    {option.icon && (
                                        <option.icon
                                            style={{
                                                transform: 'translateY(2px)',
                                            }}
                                        />
                                    )}
                                    {option.label}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default OptionsButton
