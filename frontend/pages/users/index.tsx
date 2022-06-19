import { FC } from 'react'
import Button from '../../components/Button/Button'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import { User } from '../../contexts/UserContext/types'

const UsersPage: FC = () => {
    const users = [
        {
            id: '123413',
            firstName: 'Tristan',
            lastName: 'Jeruta',
            email: 'jt.jeruta@gmail.com',
            role: 'admin',
        },
    ]

    return (
        <div className="md:container md:mx-auto p-5">
            <PageHeader title="Manage Users" buttons={[{ text: 'Add User' }]} />

            <Table
                rows={users}
                columns={[
                    {
                        title: 'User',
                        format: (user: User) => (
                            <>
                                <div className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {user.firstName} {user.lastName}
                                </div>
                                <div>{user.email}</div>
                            </>
                        ),
                        className: 'w-full',
                    },
                    {
                        title: 'Role',
                        key: 'role',
                        className: 'w-full',
                    },
                    {
                        title: ' ',
                        format: () => (
                            <div className="flex gap-10">
                                <Button type="link">Edit</Button>
                                <Button type="link">Delete</Button>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    )
}

export default UsersPage
