import { useLayoutEffect, useState } from 'react'
import UserLayout from '../../components/UserLayout/UserLayout'
import Table from '../../components/Table/Table'
import Button from '../../components/Button/Button'
import { BackupType, listBackups, restoreBackup } from '../../apis/BackupAPI'
import { formatBytes } from '../../utils'

const BackupsPage = () => {
    const [hasError, setHasError] = useState<boolean>(false)
    const [backups, setBackups] = useState<BackupType[] | null>(null)

    useLayoutEffect(() => {
        if (!backups) init()
    }, [])

    const handleRestore = (key: string) => () => {
        restoreBackup(key).then(([success]) => {
            if (success) return init()
            setHasError(true)
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
            <Table
                rows={backups || []}
                colKey="Key"
                columns={[
                    {
                        key: 'Key',
                        title: 'Filename',
                    },
                    {
                        key: 'LastModified',
                        title: 'Last Modified',
                    },
                    {
                        title: 'Size',
                        format: (item) => formatBytes(item.Size),
                    },
                    {
                        title: 'Actions',
                        format: (item) => (
                            <Button onClick={handleRestore(item.Key)}>
                                Restore
                            </Button>
                        ),
                    },
                ]}
                page={0}
                handlePageChange={() => {}}
                loading={!backups}
                hasError={hasError}
            />
        </UserLayout>
    )
}

export default BackupsPage
