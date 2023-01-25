import { FC, useCallback, useEffect } from 'react'
import clsx from 'clsx'
import { FaTimes } from 'react-icons/fa'
import Button from '../Button/Button'
import { useAppContext } from '../../contexts/AppContext/AppContext'

type Props = {
    title: string
    open: boolean
    onClose?: () => void
    content: string | JSX.Element[] | JSX.Element
    showCancelButton?: boolean
    showCloseButton?: boolean
    showSaveButton?: boolean
    closeButtonText?: string
    saveButtonText?: string
    className?: string
    disableOutsideClick?: boolean
    onSave?: () => void
    loading?: boolean
}

const Dialog: FC<Props> = (props) => {
    const AppContext = useAppContext()

    const handleClose = useCallback(
        () => (props.onClose ? props.onClose() : AppContext.closeDialog()),
        [AppContext, props]
    )

    useEffect(() => {
        const handleDialogKeyDown = (event: KeyboardEvent) => {
            if (!props.open) return null
            event.key === 'Escape' && handleClose()
            event.key === 'Enter' && props.onSave && props.onSave()
            event.key === 'Enter' &&
                !props.onSave &&
                props.showSaveButton !== false &&
                handleClose()
        }

        window.addEventListener('keydown', handleDialogKeyDown)

        return () => {
            window.removeEventListener('keydown', handleDialogKeyDown)
        }
    }, [props.open, handleClose, props])

    return (
        <div
            className={clsx(
                'fixed text-gray-500 flex items-center justify-center',
                'overflow-auto z-50 bg-black bg-opacity-50 left-0 right-0 top-0 bottom-0 transition-all',
                props.open ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            onClick={() => !props.disableOutsideClick && handleClose()}
        >
            <div
                className={clsx(
                    'bg-white relative overflow-x-auto shadow-md sm:rounded-lg h-full md:h-min w-full md:w-1/3',
                    props.className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-3 flex justify-between">
                    <h2>{props.title}</h2>
                    {(props.showCloseButton ?? true) && (
                        <button onClick={handleClose}>
                            <FaTimes />
                        </button>
                    )}
                </div>
                <hr />
                <div className="p-3">{props.content}</div>
                {(props.showCancelButton !== false ||
                    props.showSaveButton !== false) && (
                    <>
                        <hr />
                        <div className="flex justify-end gap-3 p-3">
                            {props.showCancelButton !== false && (
                                <Button
                                    color="secondary"
                                    onClick={handleClose}
                                    disabled={props.loading}
                                >
                                    Cancel
                                </Button>
                            )}
                            {props.showSaveButton !== false && (
                                <Button
                                    onClick={props.onSave}
                                    loading={props.loading}
                                >
                                    {props.saveButtonText || 'Save'}
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Dialog
