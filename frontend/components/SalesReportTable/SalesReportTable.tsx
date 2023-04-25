import { Dispatch, FC, SetStateAction, useLayoutEffect } from 'react'
import Link from 'next/link'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useStatContext } from '../../contexts/StatsContext/StatsContext'
import { SalesReport } from '../../contexts/StatsContext/types'
import { escapeRegExp, formatCurrency } from '../../utils'
import Card from '../Card/Card'
import Table from '../Table/Table'

type Props = {
    page: number
    setPage: Dispatch<SetStateAction<number>>
}
const SalesReportTable: FC<Props> = (props) => {
    const AppContext = useAppContext()
    const StatContext = useStatContext()

    const filteredReports = (StatContext.salesReports || []).filter(
        (report) => {
            const regex = new RegExp(escapeRegExp(StatContext.search), 'igm')
            return [report.productName, report.variant].some((item) =>
                regex.test(`${item}`)
            )
        }
    )

    useLayoutEffect(() => {
        StatContext.listSalesReports()
    }, [])

    return (
        <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
            <Table
                defaultSort={0}
                page={props.page}
                handlePageChange={props.setPage}
                rows={filteredReports}
                loading={AppContext.isLoading('list-product-reports')}
                columns={[
                    {
                        title: 'Product',
                        format: (row) => {
                            const report = row as SalesReport
                            return (
                                <div className="hover:text-teal-600 cursor-pointer">
                                    <Link
                                        href={`/inventory/${report.productId}`}
                                    >
                                        {report.productName}
                                    </Link>
                                </div>
                            )
                        },
                        sort: (report) => report.productName,
                    },
                    {
                        title: 'Variant',
                        key: 'variant',
                        sort: (report) => report.variant,
                    },
                    {
                        title: 'Quantity',
                        key: 'qty',
                        sort: (report) => report.qty,
                    },
                    {
                        title: 'Original Price',
                        format: (row) => {
                            const report = row as SalesReport
                            return formatCurrency(report.originalPrice)
                        },
                        sort: (report) => report.originalPrice,
                    },
                    {
                        title: 'Sale Price',
                        format: (row) => {
                            const report = row as SalesReport
                            return formatCurrency(report.price)
                        },
                        sort: (report) => report.price,
                    },
                    {
                        title: 'Average Price',
                        format: (row) => {
                            const report = row as SalesReport
                            return formatCurrency(report.avePrice)
                        },
                        sort: (report) => report.avePrice,
                    },
                ]}
            />
        </Card>
    )
}

export default SalesReportTable
