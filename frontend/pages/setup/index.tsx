import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Image from 'next/image'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useAuthContext } from '../../contexts/AuthContext/AuthContext'
import Button from '../../components/Button/Button'
import TextField from '../../components/TextField/TextField'
import { useRouter } from 'next/router'

const setupSchema = yup
    .object({
        username: yup.string().required(),
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().required(),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match'),
    })
    .required()

const Setup = () => {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()
    const Router = useRouter()
    const methods = useForm({ resolver: yupResolver(setupSchema) })

    const onSubmit = async (data: FieldValues) => {
        const attrs = {
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
        }
        const res = await AuthContext.setup(attrs)
        if (!res[0]) {
            return AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
        }

        Router.push('/')
    }

    return (
        <section className="h-screen md:container md:mx-auto">
            <div className="px-6 h-full text-gray-800">
                <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
                    <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
                        <Image
                            src="/images/login-background.webp"
                            width="700px"
                            height="500px"
                            alt="login-background"
                        />
                    </div>
                    <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
                        <h1 className="text-4xl font-bold mb-4">
                            Setup your account
                        </h1>
                        <br />
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-2">
                                    <TextField
                                        label="Username"
                                        name="username"
                                    />
                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                    />
                                    <TextField
                                        label="Last Name"
                                        name="lastName"
                                    />
                                    <TextField label="Email" name="email" />
                                    <TextField
                                        label="Password"
                                        type="password"
                                        name="password"
                                    />
                                    <TextField
                                        label="Confirm Password"
                                        type="password"
                                        name="confirmPassword"
                                    />

                                    <Button
                                        loading={AppContext.isLoading(
                                            'auth-setup'
                                        )}
                                    >
                                        Setup
                                    </Button>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Setup
