import { FC, useEffect } from 'react'
import AddEditUserDialog from '../../components/AddEditUserDialog/AddEditUserDialog'
import Button from '../../components/Button/Button'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { User } from '../../contexts/UserContext/types'
import {
    UserContextProvider,
    useUserContext,
} from '../../contexts/UserContext/UserContext'

const PageContent: FC = () => {
    const AppContext = useAppContext()
    const UserContext = useUserContext()

    useEffect(() => {
        UserContext.users === null && UserContext.listUsers()
    }, [UserContext])

    return (
        <UserLayout>
            <PageHeader
                title="Manage Users"
                buttons={[
                    {
                        text: 'Add User',
                        onClick: () => {
                            UserContext.setUserToEdit(null)
                            AppContext.openDialog('add-edit-user-dialog')
                        },
                    },
                ]}
            />

            <Table
                rows={UserContext.users || []}
                loading={AppContext.isLoading('list-users')}
                columns={[
                    {
                        title: 'User',
                        format: (row) => {
                            const user = row as User
                            return (
                                <>
                                    <div className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div>{user.email}</div>
                                </>
                            )
                        },
                        className: 'w-full',
                    },
                    {
                        title: 'Role',
                        key: 'role',
                        className: 'w-full',
                    },
                    {
                        title: ' ',
                        format: (row) => {
                            const user = row as User
                            return (
                                <div className="flex gap-10">
                                    <Button
                                        style="link"
                                        onClick={() => {
                                            UserContext.setUserToEdit(user)
                                            AppContext.openDialog(
                                                'add-edit-user-dialog'
                                            )
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button style="link">Delete</Button>
                                </div>
                            )
                        },
                    },
                ]}
            />

            <AddEditUserDialog />
        </UserLayout>
    )
}

const UsersPage = () => (
    <UserContextProvider>
        <PageContent />
    </UserContextProvider>
)

export default UsersPage
