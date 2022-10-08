import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useVendorContext } from '../../contexts/VendorContext/VendorContext'
import Dialog from '../Dialog/Dialog'
import VendorForm from './VendorForm'

const VendorDialog = () => {
    const AppContext = useAppContext()
    const VendorContext = useVendorContext()

    return (
        <Dialog
            title={`${VendorContext.selectedVendor ? 'Edit' : 'New'} Vendor`}
            open={AppContext.dialogIsOpen('add-edit-vendor-dialog')}
            content={<VendorForm />}
            showSaveButton={false}
            showCancelButton
        />
    )
}

export default VendorDialog
