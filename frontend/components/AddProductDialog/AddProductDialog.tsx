import { useAppContext } from '../../contexts/AppContext/AppContext'
import Dialog from '../Dialog/Dialog'
import AddEditProductForm from '../AddEditProductForm/AddEditProductForm'

const AddProductDialog = () => {
    const AppContext = useAppContext()

    return (
        <Dialog
            title="New Product"
            open={AppContext.dialogIsOpen('add-product-dialog')}
            content={<AddEditProductForm />}
            showSaveButton={false}
            showCancelButton={false}
            className="sm:w-1/2 lg:w-1/3 sm:h-min"
        />
    )
}

export default AddProductDialog
