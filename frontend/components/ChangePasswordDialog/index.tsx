import { FC } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useUserContext } from '../../contexts/UserContext/UserContext'
import Dialog from '../Dialog/Dialog'
import TextField from '../TextField/TextField'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const changePasswordSchema = yup
    .object({
        password1: yup.string().min(8).required(),
        password2: yup
            .string()
            .required()
            .oneOf([yup.ref('password1')], 'Passwords must match'),
    })
    .required()

const ChangePasswordDialog: FC = () => {
    const AppContext = useAppContext()
    const UserContext = useUserContext()
    const methods = useForm({ resolver: yupResolver(changePasswordSchema) })

    const onSubmit = async (data: FieldValues) => {
        if (!UserContext.userToEdit) return
        const response = await UserContext.changePassword(
            UserContext.userToEdit.id,
            data.password1
        )

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: 'Password changed!',
                type: 'success',
            })
        } else if (response[1].errors?.password) {
            const { password } = response[1].errors
            methods.setError('password1', {
                message: password?.message || 'Something went wrong',
            })
        }
    }

    return (
        <Dialog
            title="Change Password"
            open={AppContext.dialogIsOpen('change-password-dialog')}
            content={
                <FormProvider {...methods}>
                    <form>
                        <div className="flex flex-col gap-2">
                            <TextField
                                label="New Password"
                                name="password1"
                                type="password"
                                required
                                autoFocus
                            />
                            <TextField
                                label="Confirm Password"
                                name="password2"
                                type="password"
                                required
                                autoFocus
                            />
                        </div>
                    </form>
                </FormProvider>
            }
            onSave={methods.handleSubmit(onSubmit)}
        />
    )
}

export default ChangePasswordDialog
