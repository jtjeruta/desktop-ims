import { FC, useCallback, useEffect, useState } from 'react'
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
    const [status, setStatus] = useState<
        'open' | 'fading-in' | 'closed' | 'fading-out'
    >('closed')

    const handleClose = useCallback(
        () => (props.onClose ? props.onClose() : AppContext.closeDialog()),
        [AppContext, props]
    )

    useEffect(() => {
        if (props.open && status === 'closed') {
            setStatus('fading-in')
            setTimeout(() => setStatus('open'), 200)
        } else if (!props.open && status === 'open') {
            setStatus('fading-out')
            setTimeout(() => setStatus('closed'), 200)
        }
    }, [props.open, status])

    useEffect(() => {
        const handleDialogKeyDown = (event: KeyboardEvent) => {
            if (status === 'closed') return null
            event.key === 'Escape' && handleClose()
            event.key === 'Enter' && props.onSave && props.onSave()
            event.key === 'Enter' && !props.onSave && handleClose()
        }

        window.addEventListener('keydown', handleDialogKeyDown)

        return () => {
            window.removeEventListener('keydown', handleDialogKeyDown)
        }
    }, [status, handleClose, props])

    return status === 'closed' ? null : (
        <div
            className={clsx(
                'fixed text-gray-500 flex items-center justify-center p-3',
                'overflow-auto z-50 bg-black bg-opacity-50 left-0 right-0 top-0 bottom-0',
                status === 'fading-in' && 'animate-fade-in',
                status === 'fading-out' && 'animate-fade-out'
            )}
            onClick={() => !props.disableOutsideClick && handleClose()}
        >
            <div
                className={clsx(
                    'bg-white relative overflow-x-auto shadow-md sm:rounded-lg w-1/3',
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
                <hr />
                <div className="flex justify-end gap-3 p-3">
                    <Button
                        color="secondary"
                        onClick={handleClose}
                        loading={props.loading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={props.onSave} loading={props.loading}>
                        {props.saveButtonText || 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Dialog
