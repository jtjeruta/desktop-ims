import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import Image from 'next/image'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useAuthContext } from '../../contexts/AuthContext/AuthContext'
import Button from '../../components/Button/Button'
import TextField from '../../components/TextField/TextField'

const setupSchema = yup
    .object({
        email: yup.string().required(),
        code: yup.string().required(),
    })
    .required()

const ForgotPassword = () => {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()
    const Router = useRouter()
    const methods = useForm({ resolver: yupResolver(setupSchema) })

    const onSubmit = async (data: FieldValues) => {
        const res = await AuthContext.forgotPassword(data.email, data.code)
        if (!res[0]) {
            return methods.setError('code', {
                type: 'custom',
                message: 'Wrong email, username or code.',
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
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-3xl font-bold">
                                        Forgot Password
                                    </h1>
                                    <p className="text-gray-500">
                                        If you have forgotten your password,
                                        please contact the developer to receive
                                        a special code to reset your password.
                                    </p>
                                    <br />
                                    <TextField
                                        label="Username/Email"
                                        name="email"
                                    />
                                    <TextField label="Code" name="code" />
                                    <Link href="/login">
                                        <span className="hover:text-blue-400 cursor-pointer">
                                            Login using password instead?
                                        </span>
                                    </Link>
                                    <Button
                                        loading={AppContext.isLoading(
                                            'auth-forgot-password'
                                        )}
                                    >
                                        Login to Account
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

export default ForgotPassword
