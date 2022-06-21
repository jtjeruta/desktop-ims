import clsx from 'clsx'
import { FC } from 'react'
import { FaTimes } from 'react-icons/fa'
import Button from '../Button/Button'

type Props = {
    title: string
    open: boolean
    onClose: () => void
    content: string | JSX.Element[]
    showCancelButton?: boolean
    showCloseButton?: boolean
    showSaveButton?: boolean
    closeButtonText?: string
    saveButtonText?: string
    className?: string
    disableOutsideClick?: boolean
}

const Dialog: FC<Props> = (props) => {
    return (
        <div
            className={clsx(
                'fixed text-gray-500 flex items-center justify-center p-3',
                'overflow-auto z-50 bg-black bg-opacity-50 left-0 right-0 top-0 bottom-0',
                !props.open && 'hidden'
            )}
            onClick={!props.disableOutsideClick ? props.onClose : () => null}
        >
            <div
                className={clsx(
                    'bg-white relative overflow-x-auto shadow-md sm:rounded-lg w-1/3',
                    props.className
                )}
            >
                <div className="p-3 flex justify-between">
                    <h2>{props.title}</h2>
                    {(props.showCloseButton ?? true) && (
                        <button onClick={props.onClose}>
                            <FaTimes />
                        </button>
                    )}
                </div>
                <hr />
                <div className="p-3">{props.content}</div>
                <hr />
                <div className="flex justify-end gap-3 p-3">
                    <Button onClick={props.onClose}>Cancel</Button>
                    <Button>Save</Button>
                </div>
            </div>
        </div>
    )
}

export default Dialog
