import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import Image from 'next/image'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useAuthContext } from '../../contexts/AuthContext/AuthContext'
import Button from '../../components/Button/Button'
import TextField from '../../components/TextField/TextField'

const Login = () => {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()
    const methods = useForm()

    const onSubmit = async (data: FieldValues) => {
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
                        {process.env.NODE_ENV === 'development' && (
                            <div className="flex flex-col gap-5 mt-5">
                                <div className="text-center">
                                    [[ Dev Mode Quick Login ]]
                                </div>
                                <Button
                                    loading={AppContext.isLoading('auth-login')}
                                    onClick={() =>
                                        AuthContext.login(
                                            'admin@gmail.com',
                                            'password'
                                        )
                                    }
                                >
                                    Login as Admin
                                </Button>
                                <Button
                                    loading={AppContext.isLoading('auth-login')}
                                    onClick={() =>
                                        AuthContext.login(
                                            'employee@gmail.com',
                                            'password'
                                        )
                                    }
                                >
                                    Login as Employee
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login
