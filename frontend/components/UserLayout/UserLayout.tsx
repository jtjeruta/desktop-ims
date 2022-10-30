import { FC } from 'react'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'

type Props = {
    children: (JSX.Element | false)[]
}

const UserLayout: FC<Props> = (props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="grow flex">
                <Sidebar />
                <div className="grow p-2 md:p-6 bg-gray-100 overflow-x-auto">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default UserLayout
