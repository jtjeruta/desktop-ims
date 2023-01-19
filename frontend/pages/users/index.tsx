import { FC, useEffect, useState } from 'react'
import AddEditUserDialog from '../../components/AddEditUserDialog/AddEditUserDialog'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import SearchBar from '../../components/SearchBar/SearchBar'
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
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState<number>(0)

    const handleEditUser = (user: User) => () => {
        UserContext.setUserToEdit(user)
        AppContext.openDialog('add-edit-user-dialog')
    }

    useEffect(() => {
        UserContext.users === null && UserContext.listUsers()
    }, [UserContext])

    return (
        <UserLayout>
            <div className="flex justify-end mb-6 gap-3">
                <SearchBar
                    onSearch={(text) => setSearch(text)}
                    inputClass="!text-base h-full !bg-white"
                />
                <Button
                    onClick={() => {
                        UserContext.setUserToEdit(null)
                        AppContext.openDialog('add-edit-user-dialog')
                    }}
                >
                    Add User
                </Button>
            </div>

            <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
                <Table
                    page={page}
                    handlePageChange={(newPage) => setPage(newPage)}
                    rows={(UserContext.users ?? []).filter((user) =>
                        [user.firstName, user.lastName, user.email].some(
                            (attr) => new RegExp(search, 'igm').test(attr)
                        )
                    )}
                    loading={AppContext.isLoading('list-users')}
                    columns={[
                        {
                            title: 'User',
                            format: (row) => {
                                const user = row as User
                                return (
                                    <div
                                        className="hover:text-teal-600 cursor-pointer"
                                        onClick={handleEditUser(user)}
                                    >
                                        {user.firstName} {user.lastName}
                                    </div>
                                )
                            },
                            sort: (user) =>
                                [user.firstName, user.lastName].join(' '),
                        },
                        {
                            title: 'Email',
                            bodyClsx: 'w-full',
                            format: (row) => {
                                const user = row as User
                                return (
                                    <div
                                        className="hover:text-teal-600 cursor-pointer"
                                        onClick={handleEditUser(user)}
                                    >
                                        {user.email}
                                    </div>
                                )
                            },
                            sort: (user) => user.email,
                        },
                        {
                            title: 'Role',
                            key: 'role',
                            sort: (user) => user.role,
                        },
                        {
                            title: ' ',
                            format: (row) => {
                                const user = row as User
                                return (
                                    <div className="flex gap-10">
                                        <Button
                                            style="link"
                                            onClick={handleEditUser(user)}
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
