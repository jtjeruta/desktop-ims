import { FC, useEffect } from 'react'
import AddEditUserDialog from '../../components/AddEditUserDialog/AddEditUserDialog'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useAuthContext } from '../../contexts/AuthContext/AuthContext'
import { User } from '../../contexts/UserContext/types'
import {
    UserContextProvider,
    useUserContext,
} from '../../contexts/UserContext/UserContext'

const PageContent: FC = () => {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()
    const UserContext = useUserContext()

    useEffect(() => {
        UserContext.users === null && UserContext.listUsers()
    }, [UserContext])

    return (
        <UserLayout>
            <PageHeader
                breadcrumbs={[{ text: 'Manage Users' }]}
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

            <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
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
                            bodyClsx: 'w-full',
                        },
                        {
                            title: 'Role',
                            key: 'role',
                            bodyClsx: 'w-full',
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
                                        <Button
                                            style="link"
                                            onClick={() => {
                                                UserContext.setUserToDelete(
                                                    user
                                                )
                                                AppContext.openDialog(
                                                    'delete-user-dialog'
                                                )
                                            }}
                                            disabled={
                                                user.id === AuthContext.user?.id
                                            }
                                            disabledText="Can not delete self"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )
                            },
                        },
                    ]}
                />
            </Card>

            <AddEditUserDialog />
            <ConfirmDialog
                text={`Delete user ${UserContext.userToDelete?.firstName} ${UserContext.userToDelete?.lastName}?`}
                dialogKey="delete-user-dialog"
                onConfirm={async () => {
                    if (UserContext.userToDelete) {
                        await UserContext.removeUser(
                            UserContext.userToDelete?.id
                        )
                        AppContext.closeDialog()
                    }
                }}
                loading={AppContext.isLoading('remove-user')}
            />
        </UserLayout>
    )
}

const UsersPage = () => (
    <UserContextProvider>
        <PageContent />
    </UserContextProvider>
)

export default UsersPage
