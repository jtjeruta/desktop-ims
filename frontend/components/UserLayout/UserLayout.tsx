import { FC } from 'react'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'

type Props = {
    children: (JSX.Element | false)[]
}

const UserLayout: FC<Props> = (props) => {
    return (
        <div className="flex flex-col overflow-y-hidden h-screen">
            <Navbar />
            <div className="grow flex overflow-y-auto">
                <Sidebar />
                <div className="grow p-2 md:p-6 bg-gray-100 overflow-x-auto">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default UserLayout
