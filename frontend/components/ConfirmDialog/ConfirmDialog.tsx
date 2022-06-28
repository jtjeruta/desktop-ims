import { FC } from 'react'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import Dialog from '../Dialog/Dialog'

type Props = {
    dialogKey: string
    text: string
    onConfirm: () => void
    loading?: boolean
}
const ConfirmDialog: FC<Props> = (props) => {
    const AppContext = useAppContext()

    return (
        <Dialog
            title="Please confirm!"
            content={props.text}
            open={AppContext.dialogIsOpen(props.dialogKey)}
            onSave={props.onConfirm}
            saveButtonText={'Confirm'}
            loading={props.loading}
        />
    )
}

export default ConfirmDialog
