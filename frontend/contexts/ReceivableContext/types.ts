import { AxiosResponse } from 'axios'

export type Receivable = {
    id: string
    name: string
    description: string
    date: number
    amount: number
}

export type AddEditReceivableDoc = {
    id?: string
    name: string
    description: string
    date: number
    amount: number
}

export type CreateUpdateReceivableErrors = Record<
    keyof Receivable,
    { message: string }
>

export type CreateReceivable = (
    receivable: AddEditReceivableDoc
) => Promise<
    | [true, Receivable]
    | [false, { message: string; errors?: CreateUpdateReceivableErrors }]
>
export type UpdateReceivable = (
    id: string,
    receivable: AddEditReceivableDoc
) => Promise<
    | [true, Receivable]
    | [false, { message: string; errors?: CreateUpdateReceivableErrors }]
>

export type ListReceivables = () => Promise<
    [true, Receivable[]] | [false, string]
>
export type GetReceivable = (
    id: Receivable['id']
) => Promise<[true, Receivable] | [false, AxiosResponse]>

export type DeleteReceivable = (
    id: Receivable['id']
) => Promise<[true] | [false, AxiosResponse]>

export type Context = {
    receivables: Receivable[] | null
    selectedReceivable: Receivable | null
    deleteReceivable: DeleteReceivable
    draftReceivable: AddEditReceivableDoc
    createReceivable: CreateReceivable
    updateReceivable: UpdateReceivable
    listReceivables: ListReceivables
    setSelectedReceivable: (receivable: Receivable | null) => void
    setDraftReceivable: React.Dispatch<
        React.SetStateAction<AddEditReceivableDoc>
    >
}
