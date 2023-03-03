import moment from 'moment'
import React, { useMemo, useState } from 'react'
import * as ReceivablesAPI from '../../apis/ReceivableAPI'
import { useAppContext } from '../AppContext/AppContext'
import * as Types from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReceivableContext = React.createContext<Types.Context | any>({})

const ReceivableContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [receivables, setReceivables] = useState<Types.Receivable[] | null>(
        null
    )
    const [selectedReceivable, setSelectedReceivable] =
        useState<Types.Receivable | null>(null)
    const [draftReceivable, setDraftReceivable] =
        useState<Types.AddEditReceivableDoc>({
            name: '',
            description: '',
            date: moment().unix(),
            amount: 0,
        })

    const createReceivable: Types.CreateReceivable = async (receivableDoc) => {
        const key = 'add-receivable'

        AppContext.addLoading(key)
        const response = await ReceivablesAPI.createReceivable(receivableDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return [false, response[1].data]
        }

        setReceivables((prev) => [response[1], ...(prev || [])])
        return [true, response[1]]
    }

    const updateReceivable: Types.UpdateReceivable = async (
        id,
        receivableDoc
    ) => {
        const key = 'update-receivable'

        AppContext.addLoading(key)
        const response = await ReceivablesAPI.updateReceivable(
            id,
            receivableDoc
        )
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        // update receivables
        setReceivables((prev) =>
            (prev || []).map((receivable) => {
                if (receivable.id !== id) return receivable
                return response[1]
            })
        )

        // update current receivable details
        if (id === selectedReceivable?.id) {
            setSelectedReceivable(response[1])
        }

        return [true, response[1]]
    }

    const listReceivables: Types.ListReceivables = async () => {
        const key = 'list-receivables'

        AppContext.addLoading(key)
        const response = await ReceivablesAPI.listReceivables()
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setReceivables(response[1])
        return response
    }

    const deleteReceivable: Types.DeleteReceivable = async (id) => {
        const key = 'delete-receivable'

        AppContext.addLoading(key)
        const response = await ReceivablesAPI.deleteReceivable(id)
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setReceivables((prev) =>
            (prev || []).filter((receivable) => receivable.id !== id)
        )
        return response
    }

    const value: Types.Context = useMemo(
        () => ({
            receivables,
            selectedReceivable,
            deleteReceivable,
            draftReceivable,
            setDraftReceivable,
            createReceivable,
            updateReceivable,
            listReceivables,
            setSelectedReceivable,
        }),
        [receivables, selectedReceivable, draftReceivable]
    )

    return (
        <ReceivableContext.Provider value={value}>
            {children}
        </ReceivableContext.Provider>
    )
}

const useReceivableContext = () =>
    React.useContext<Types.Context>(ReceivableContext)

export { ReceivableContext, ReceivableContextProvider, useReceivableContext }
