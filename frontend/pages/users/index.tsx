import { FC, useState } from 'react'
import AddEditUserDialog from '../../components/AddEditUserDialog/AddEditUserDialog'
import Button from '../../components/Button/Button'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { User } from '../../contexts/UserContext/types'

const users: User[] = [
    {
        id: '123413',
        firstName: 'Tristan',
        lastName: 'Jeruta',
        email: 'jt.jeruta@gmail.com',
        role: 'admin',
    },
]

const UsersPage: FC = () => {
    const AppContext = useAppContext()
    const [userToEdit, setUserToEdit] = useState<User | undefined>()

    return (
        <UserLayout>
            <PageHeader
                title="Manage Users"
                buttons={[
                    {
                        text: 'Add User',
                        onClick: () =>
                            AppContext.openDialog('add-edit-user-dialog'),
                    },
                ]}
            />

            <Table
                rows={users}
                columns={[
                    {
                        title: 'User',
                        format: (user) => (
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
                        format: (user: User) => (
                            <div className="flex gap-10">
                                <Button
                                    style="link"
                                    onClick={() => {
                                        setUserToEdit(user)
                                        AppContext.openDialog(
                                            'add-edit-user-dialog'
                                        )
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button style="link">Delete</Button>
                            </div>
                        ),
                    },
                ]}
            />
            <AddEditUserDialog user={userToEdit} />
        </UserLayout>
    )
}

export default UsersPage
