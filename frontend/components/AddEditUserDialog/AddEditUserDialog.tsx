import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { User } from '../../contexts/UserContext/types'
import { useUserContext } from '../../contexts/UserContext/UserContext'
import Dialog from '../Dialog/Dialog'
import TextField from '../TextField/TextField'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Select from '../Select/Select'

const createUserSchema = yup
    .object({
        email: yup.string().email().required(),
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        role: yup.string().required(),
    })
    .required()

type Props = {
    user?: User
}

const AddEditUserDialog: FC<Props> = (props) => {
    const AppContext = useAppContext()
    const UserContext = useUserContext()
    const methods = useForm({ resolver: yupResolver(createUserSchema) })

    const onSubmit = async (data: { [x: string]: any }) => {
        const doc = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
        }

        const response = await UserContext.addUser(doc)

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({ title: 'User added!' })
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
            title={`${props.user ? 'Edit' : 'New'} User`}
            open={AppContext.dialogIsOpen('add-edit-user-dialog')}
            content={
                <FormProvider {...methods}>
                    <form>
                        <div className="flex flex-col gap-2">
                            <TextField
                                label="Email address"
                                name="email"
                                required
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
                            {/* <TextField label="Role" name="role" required /> */}
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
            onClose={() => {
                methods.reset()
                AppContext.closeDialog()
            }}
        />
    )
}

export default AddEditUserDialog
