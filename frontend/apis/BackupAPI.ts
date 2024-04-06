import Axios from './AxiosAPI'
import { AxiosResponse } from 'axios'

export type BackupType = {
    Key: string
    LastModified: string
    Size: number
}

export const listBackups = () =>
    Axios()
        .get('/api/v1/backups')
        .then((response): [true, BackupType[]] => [true, response.data])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const restoreBackup = (key: string) =>
    Axios()
        .post('/api/v1/backups/restore', { key })
        .then((): [true] => [true])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const createBackup = () =>
    Axios()
        .post('/api/v1/backups')
        .then((): [true] => [true])
        .catch((err): [false, AxiosResponse] => [false, err.response])
