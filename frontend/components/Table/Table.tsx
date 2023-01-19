import { FC, useEffect, useState } from 'react'
import clsx from 'clsx'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { compare } from '../../uitls'
import TablePagination from './TablePagination'
import { ITEMS_PER_TABLE } from '../../constants'

type SortFunction = (a: Row, b: Row) => number

// eslint-disable-next-line
type Row = Record<string, any>
type Column = {
    title: string
    headerClsx?: string
    bodyClsx?: string
    sort?: (row: Row) => string | number
} & (
    | {
          key: string
      }
    | {
          format: (item: Row) => number | string | JSX.Element
      }
)

type Props = {
    rows: Row[]
    columns: Column[]
    loading?: boolean
    page: number
    handlePageChange: (page: number) => void
    defaultSort?: number // refers to the column number
}

const Table: FC<Props> = (props) => {
    const sortNull = () => 0
    const sortASC = (col: Column) => (a: Row, b: Row) =>
        compare(col.sort?.(b), col.sort?.(a))
    const sortDESC = (col: Column) => (a: Row, b: Row) =>
        compare(col.sort?.(a), col.sort?.(b))

    const [sort, setSort] = useState<{
        sort: SortFunction
        ascending: boolean
        col: string
    }>({ sort: sortNull, ascending: true, col: '' })

    const handleSort = (col: Column) => () => {
        if (!col.sort) return
        const ascending = sort.col !== col.title ? true : !sort.ascending

        setSort({
            col: col.title,
            ascending,
            sort: !ascending ? sortASC(col) : sortDESC(col),
        })
    }

    const sortedRows = props.rows.sort(sort.sort)
    const filteredRows = sortedRows.filter(
        (row, index) =>
            index >= props.page * ITEMS_PER_TABLE + 1 &&
            index <= (props.page + 1) * ITEMS_PER_TABLE
    )

    useEffect(() => {
        if (
            props.defaultSort !== undefined &&
            sort.col === '' &&
            props.columns[props.defaultSort]
        ) {
            handleSort(props.columns[props.defaultSort])()
        }
    }, [props, handleSort])

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase">
                        <tr>
                            {props.columns.map((col) => (
                                <th
                                    key={col.title}
                                    className={clsx(
                                        'pl-6 py-3 text-xs font-medium leading-4 tracking-wider whitespace-nowrap',
                                        'text-left text-gray-500 uppercase border-b border-gray-200',
                                        col.headerClsx,
                                        col.sort && 'cursor-pointer'
                                    )}
                                    onClick={handleSort(col)}
                                >
                                    <div className="flex justify-between gap-2">
                                        <span>{col.title}</span>
                                        <span
                                            style={{
                                                transform: 'translateY(2px)',
                                            }}
                                        >
                                            {!col.sort ? null : sort.col !==
                                              col.title ? (
                                                <FaSort className="text-gray-300" />
                                            ) : sort.ascending ? (
                                                <FaSortDown />
                                            ) : (
                                                <FaSortUp />
                                            )}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white">
                        {props.loading ? (
                            <>
                                <TableRow columns={props.columns} loading />
                                <TableRow columns={props.columns} loading />
                                <TableRow columns={props.columns} loading />
                            </>
                        ) : filteredRows.length > 0 ? (
                            filteredRows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    row={row}
                                    columns={props.columns}
                                />
                            ))
                        ) : (
                            <tr className="bg-white border-b">
                                <td
                                    className="px-6 py-3 border-b border-gray-200 whitespace-nowrap"
                                    colSpan={props.columns.length}
                                >
                                    No results found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {!props.loading &&
                sortedRows.length > props.page &&
                sortedRows.length > ITEMS_PER_TABLE && (
                    <TablePagination
                        totalRecords={sortedRows.length}
                        className="p-3"
                        page={props.page}
                        handlePageChange={props.handlePageChange}
                    />
                )}
        </>
    )
}

type TableRow = {
    columns: Column[]
} & (
    | {
          row: Row
      }
    | {
          loading: true
      }
)

const TableRow: FC<TableRow> = (props) => {
    return (
        <tr className="bg-white border-b">
            {props.columns.map((col) => (
                <td
                    key={col.title}
                    className={clsx(
                        'px-6 py-3 border-b border-gray-200 whitespace-nowrap',
                        col.bodyClsx
                    )}
                >
                    {'loading' in props ? (
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200" />
                        </div>
                    ) : 'key' in col ? (
                        props.row[col.key]
                    ) : (
                        col.format(props.row)
                    )}
                </td>
            ))}
        </tr>
    )
}

export default Table
