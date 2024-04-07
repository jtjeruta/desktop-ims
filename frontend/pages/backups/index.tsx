import { useLayoutEffect, useState } from 'react'
import UserLayout from '../../components/UserLayout/UserLayout'
import Table from '../../components/Table/Table'
import Button from '../../components/Button/Button'
import {
    BackupType,
    createBackup,
    listBackups,
    restoreBackup,
} from '../../apis/BackupAPI'
import { formatBytes } from '../../utils'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'

const restoreBackupKey = 'restore-backup-dialog'
const createBackupKey = 'create-backup-dialog'

const BackupsPage = () => {
    const AppContext = useAppContext()
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState<number>(0)
    const [hasError, setHasError] = useState<boolean>(false)
    const [backups, setBackups] = useState<BackupType[] | null>(null)
    const [selectedKey, setSelectedKey] = useState<string | null>(null)

    useLayoutEffect(() => {
        if (!backups) init()
    }, [])

    const handleRestore = () => {
        if (!selectedKey) {
            return AppContext.addNotification({
                type: 'danger',
                title: 'No backup selected',
            })
        }

        AppContext.addLoading(restoreBackupKey)
        restoreBackup(selectedKey).then(([success]) => {
            AppContext.removeLoading(restoreBackupKey)
            AppContext.closeDialog()

            if (!success) {
                return AppContext.addNotification({
                    type: 'danger',
                    title: 'Failed to restore backup',
                })
            }

            AppContext.addNotification({
                type: 'success',
                title: 'Backup restored successfully',
            })

            init()
        })
    }

    const handleCreateBackup = () => {
        AppContext.addLoading(createBackupKey)
        createBackup().then(([success]) => {
            AppContext.removeLoading(createBackupKey)
            AppContext.closeDialog()
            if (!success) {
                return AppContext.addNotification({
                    type: 'danger',
                    title: 'Failed to create backup',
                })
            }

            AppContext.addNotification({
                type: 'success',
                title: 'Backup created successfully',
            })

            init()
        })
    }

    async function init() {
        setHasError(false)
        setBackups(null)

        const [success, data] = await listBackups()
        if (!success) {
            setHasError(true)
            return
        }

        setBackups(data)
    }

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
                    className="hidden md:block"
                    onClick={() => AppContext.openDialog(createBackupKey)}
                >
                    Create Backup
                </Button>
            </div>
            <Table
                rows={(backups || []).filter((item) =>
                    item.Key.toLowerCase().includes(search.toLowerCase())
                )}
                colKey="Key"
                columns={[
                    {
                        key: 'Key',
                        title: 'Filename',
                    },
                    {
                        title: 'Size',
                        format: (item) => formatBytes(item.Size),
                    },
                    {
                        title: 'Actions',
                        format: (item) => (
                            <Button
                                onClick={() => {
                                    setSelectedKey(item.Key)
                                    AppContext.openDialog(restoreBackupKey)
                                }}
                            >
                                Restore
                            </Button>
                        ),
                    },
                ]}
                page={page}
                handlePageChange={setPage}
                loading={!backups}
                hasError={hasError}
            />
            <ConfirmDialog
                dialogKey={restoreBackupKey}
                text="Are you sure you want to restore the backup?"
                onConfirm={handleRestore}
                loading={AppContext.isLoading(restoreBackupKey)}
            />
            <ConfirmDialog
                dialogKey={createBackupKey}
                text="Are you sure you want to create a backup?"
                onConfirm={handleCreateBackup}
                loading={AppContext.isLoading(createBackupKey)}
            />
        </UserLayout>
    )
}

export default BackupsPage
