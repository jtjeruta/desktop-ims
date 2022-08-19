import { FC } from 'react'
import Navbar from '../Navbar/Navbar'

type Props = {
    children: (JSX.Element | false)[]
}

const UserLayout: FC<Props> = (props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex grow bg-slate-100 dark:bg-slate-800">
                <div className="flex flex-col md:container md:mx-auto p-5">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default UserLayout
