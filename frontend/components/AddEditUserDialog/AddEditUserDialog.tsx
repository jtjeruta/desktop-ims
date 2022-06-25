import { FC } from 'react'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { User } from '../../contexts/UserContext/types'
import Dialog from '../Dialog/Dialog'

type Props = {
    user?: User
}

const AddEditUserDialog: FC<Props> = (props) => {
    const AppContext = useAppContext()
    const key = 'add-edit-user-dialog'

    return (
        <Dialog
            title={`${props.user ? 'Edit' : 'New'} User`}
            open={AppContext.dialogIsOpen(key)}
            content="Test Content"
        />
    )
}

export default AddEditUserDialog
