import { useRouter } from 'next/router'
import { FC, useLayoutEffect, useState } from 'react'
import { ActionButton } from '../../components/ActionButton/ActionButton'
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
import ChangePasswordDialog from '../../components/ChangePasswordDialog'

const PageContent: FC = () => {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()
    const UserContext = useUserContext()
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState<number>(0)
    const router = useRouter()

    const openUserDialog = (user: User | null) => () => {
        UserContext.setUserToEdit(user)
        AppContext.openDialog('add-edit-user-dialog')
    }

    const openPasswordDialog = (user: User | null) => () => {
        UserContext.setUserToEdit(user)
        AppContext.openDialog('change-password-dialog')
    }

    useLayoutEffect(() => {
        async function init() {
            const response = await UserContext.listUsers()
            if (!response[0]) return router.push('/500')
        }

        init()
    }, [])

    return (
        <UserLayout>
            <div className="flex justify-end mb-4 gap-3">
                <SearchBar
                    onSearch={(search) => {
                        setSearch(search)
                        setPage(0)
                    }}
                    inputClass="!text-base h-full !bg-white"
                />
                <Button
                    onClick={openUserDialog(null)}
                    className="hidden md:block"
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
                                        onClick={openUserDialog(user)}
                                    >
                                        {user.firstName} {user.lastName}
                                    </div>
                                )
                            },
                            sort: (user) =>
                                [user.firstName, user.lastName].join(' '),
                        },
                        {
                            title: 'Username',
                            format: (row) => {
                                const user = row as User
                                return (
                                    <div
                                        className="hover:text-teal-600 cursor-pointer"
                                        onClick={openUserDialog(user)}
                                    >
                                        {user.username}
                                    </div>
                                )
                            },
                            sort: (user) => user.username,
                        },
                        {
                            title: 'Email',
                            bodyClsx: 'w-full',
                            format: (row) => {
                                const user = row as User
                                return (
                                    <div
                                        className="hover:text-teal-600 cursor-pointer"
                                        onClick={openUserDialog(user)}
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
                                    <div className="flex">
                                        <Button
                                            style="link"
                                            onClick={openUserDialog(user)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            style="link"
                                            onClick={openPasswordDialog(user)}
                                        >
                                            Change Password
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

            <ChangePasswordDialog />
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
            <ActionButton onClick={openUserDialog(null)} />
        </UserLayout>
    )
}

const UsersPage = () => (
    <UserContextProvider>
        <PageContent />
    </UserContextProvider>
)

export default UsersPage
