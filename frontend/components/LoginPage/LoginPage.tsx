import { FormProvider, useForm } from 'react-hook-form'
import Image from 'next/image'
import Button from '../Button/Button'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useAuthContext } from '../../contexts/AuthContext/AuthContext'
import TextField from '../TextField/TextField'

const Login = () => {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()
    const methods = useForm()

    const onSubmit = async (data: { [x: string]: any }) => {
        const res = await AuthContext.login(data.email, data.password)
        if (!res[0] && res[1].status === 400) {
            methods.setError('email', {
                type: 'custom',
                message: 'Wrong email or password.',
            })
            methods.setError('password', {
                type: 'custom',
                message: 'Wrong email or password.',
            })
        }
    }

    return (
        <section className="h-screen">
            <div className="px-6 h-full text-gray-800">
                <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
                    <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
                        <Image
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            className="w-full"
                            alt="Sample image"
                        />
                    </div>
                    <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-2">
                                    <TextField
                                        label="Email address"
                                        name="email"
                                    />

                                    <TextField
                                        label="Password"
                                        type="password"
                                        name="password"
                                    />

                                    <Button
                                        loading={AppContext.isLoading(
                                            'auth-login'
                                        )}
                                    >
                                        Login
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

export default Login
