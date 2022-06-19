import clsx from 'clsx'
import { FC } from 'react'

type Props = {
    rows: ({ id: string } & { [key: string]: any })[]
    columns: ({ title: string; className?: string } & (
        | {
              key: string
          }
        | {
              format: (item: any) => string | JSX.Element
          }
    ))[]
}

const Table: FC<Props> = (props) => {
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {props.columns.map((col) => (
                            <th
                                key={col.title}
                                className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200"
                            >
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="bg-white">
                    {props.rows.map((row) => (
                        <tr
                            key={row.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            {props.columns.map((col) => (
                                <td
                                    key={col.title}
                                    className={clsx(
                                        'px-6 py-4 border-b border-gray-200 whitespace-nowrap',
                                        col.className
                                    )}
                                >
                                    {'key' in col
                                        ? row[col.key]
                                        : col.format(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table
