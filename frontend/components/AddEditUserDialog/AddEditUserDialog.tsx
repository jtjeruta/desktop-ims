import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useUserContext } from '../../contexts/UserContext/UserContext'
import Dialog from '../Dialog/Dialog'
import TextField from '../TextField/TextField'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Select from '../Select/Select'

const addEditUserSchema = yup
    .object({
        email: yup.string().email().required(),
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        role: yup.string().required(),
    })
    .required()

const AddEditUserDialog: FC = () => {
    const AppContext = useAppContext()
    const UserContext = useUserContext()
    const methods = useForm({ resolver: yupResolver(addEditUserSchema) })

    useEffect(() => {
        methods.setValue('email', UserContext.userToEdit?.email)
        methods.setValue('firstName', UserContext.userToEdit?.firstName)
        methods.setValue('lastName', UserContext.userToEdit?.lastName)
        methods.setValue('role', UserContext.userToEdit?.role)
    }, [UserContext.userToEdit, methods])

    const onSubmit = async (data: { [x: string]: any }) => {
        const doc = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
        }

        const response = await (UserContext.userToEdit
            ? UserContext.updateUser(UserContext.userToEdit.id, doc)
            : UserContext.createUser(doc))

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: !UserContext.userToEdit
                    ? 'User added!'
                    : 'User updated!',
            })
        } else if (response[1].errors) {
            const { errors } = response[1]

            ;(Object.keys(errors) as Array<keyof typeof errors>).map((key) => {
                methods.setError(key, {
                    type: 'custom',
                    message: errors[key]?.message,
                })
            })
        } else if (response[1].message) {
            methods.setError('email', {
                type: 'custom',
                message: 'Email already taken',
            })
        }
    }

    return (
        <Dialog
            title={`${UserContext.userToEdit ? 'Edit' : 'New'} User`}
            open={AppContext.dialogIsOpen('add-edit-user-dialog')}
            content={
                <FormProvider {...methods}>
                    <form>
                        <div className="flex flex-col gap-2">
                            <TextField
                                label="Email address"
                                name="email"
                                required
                                autoFocus
                            />
                            <TextField
                                label="First Name"
                                name="firstName"
                                required
                            />
                            <TextField
                                label="Last Name"
                                name="lastName"
                                required
                            />
                            <Select
                                label="Role"
                                name="role"
                                required
                                options={[
                                    { value: 'employee', text: 'Employee' },
                                    { value: 'admin', text: 'Admin' },
                                ]}
                            />
                        </div>
                    </form>
                </FormProvider>
            }
            onSave={methods.handleSubmit(onSubmit)}
            loading={AppContext.isLoading('add-user')}
        />
    )
}

export default AddEditUserDialog
