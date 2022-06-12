import { useState } from 'react'
import Button from './Button'
import Input from './Input'

const Login = () => {
    const [loading] = useState<boolean>(false)
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="bg-white rounded-lg w-full max-w-sm py-16 px-5">
                <form>
                    <div className="flex font-bold justify-center">
                        <img
                            className="h-20 w-20"
                            src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/master/img/avatar.svg"
                            alt="avatar"
                        />
                    </div>
                    <h2 className="text-3xl text-center text-gray-700 mb-4">
                        Login Form
                    </h2>
                    <Input type="email" />
                    <Input type="password" />
                    <br />
                    <Button>Log-in</Button>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="flex flex-col gap-4 mt-4">
                            <div className="text-center">
                                [[ Dev Mode Quick Logins ]]
                            </div>
                            <Button loading={loading} type="button">
                                Log in as admin
                            </Button>
                            <Button loading={loading} type="button">
                                Log in as employee
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Login
