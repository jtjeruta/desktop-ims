import { FC } from 'react'
import clsx from 'clsx'

// eslint-disable-next-line
type Row = Record<string, any>
type Column = {
    title: string
    headerClsx?: string
    bodyClsx?: string
} & (
    | {
          key: string
      }
    | {
          // eslint-disable-next-line
          format: (item: Row) => string | JSX.Element
      }
)

type Props = {
    rows: Row[]
    columns: Column[]
    loading?: boolean
}

const Table: FC<Props> = (props) => {
    return (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                    {props.columns.map((col) => (
                        <th
                            key={col.title}
                            className={clsx(
                                'px-6 py-3 text-xs font-medium leading-4 tracking-wider',
                                'text-left text-gray-500 uppercase border-b border-gray-200',
                                col.headerClsx
                            )}
                        >
                            {col.title}
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
                ) : (
                    props.rows.map((row) => (
                        <TableRow
                            key={row.id}
                            row={row}
                            columns={props.columns}
                        />
                    ))
                )}
            </tbody>
        </table>
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
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            {props.columns.map((col) => (
                <td
                    key={col.title}
                    className={clsx(
                        'px-6 py-4 border-b border-gray-200 whitespace-nowrap',
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
