import { FC } from 'react'
import Navbar from '../Navbar/Navbar'

type Props = {
    children: JSX.Element[]
}

const UserLayout: FC<Props> = (props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex grow">
                <div className="flex flex-col md:container md:mx-auto p-5">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default UserLayout