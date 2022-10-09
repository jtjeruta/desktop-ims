import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useVendorContext } from '../../contexts/VendorContext/VendorContext'
import Dialog from '../Dialog/Dialog'
import AddEditVendorForm from './AddEditVendorForm'

const AddEditVendorDialog = () => {
    const AppContext = useAppContext()
    const VendorContext = useVendorContext()

    return (
        <Dialog
            title={`${VendorContext.selectedVendor ? 'Edit' : 'New'} Vendor`}
            open={AppContext.dialogIsOpen('add-edit-vendor-dialog')}
            content={<AddEditVendorForm />}
            showSaveButton={false}
            showCancelButton
        />
    )
}

export default AddEditVendorDialog
