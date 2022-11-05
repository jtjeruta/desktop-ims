import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useCustomerContext } from '../../contexts/CustomerContext/CustomerContext'
import Dialog from '../Dialog/Dialog'
import AddEditCustomerForm from './AddEditCustomerForm'

const AddEditCustomerDialog = () => {
    const AppContext = useAppContext()
    const CustomerContext = useCustomerContext()

    return (
        <Dialog
            title={`${
                CustomerContext.selectedCustomer ? 'Edit' : 'New'
            } Customer`}
            open={AppContext.dialogIsOpen('add-edit-customer-dialog')}
            content={<AddEditCustomerForm />}
            showSaveButton={false}
            showCancelButton={false}
        />
    )
}

export default AddEditCustomerDialog
