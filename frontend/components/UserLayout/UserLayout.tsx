import { FC } from 'react'
import Navbar from '../Navbar/Navbar'
import Backdrop from '../Sidebar/Backdrop'
import Sidebar from '../Sidebar/Sidebar'

type Props = {
    children: React.ReactNode
    backButton?: boolean
}

const UserLayout: FC<Props> = (props) => {
    return (
        <div className="flex flex-col overflow-y-hidden h-screen">
            <Navbar backButton={props.backButton} />
            <div className="grow flex overflow-y-auto relative">
                <Backdrop />
                <Sidebar />
                <div className="grow p-2 md:p-6 bg-gray-100 overflow-x-auto">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default UserLayout
