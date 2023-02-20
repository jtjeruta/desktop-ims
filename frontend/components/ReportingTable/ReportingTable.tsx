import { Dispatch, FC, SetStateAction, useLayoutEffect } from 'react'
import Link from 'next/link'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useStatContext } from '../../contexts/StatsContext/StatsContext'
import { ProductReport } from '../../contexts/StatsContext/types'
import { escapeRegExp, formatCurrency } from '../../utils'
import Card from '../Card/Card'
import Table from '../Table/Table'

type Props = {
    page: number
    setPage: Dispatch<SetStateAction<number>>
}
const ReportingTable: FC<Props> = (props) => {
    const AppContext = useAppContext()
    const StatContext = useStatContext()

    const filteredReports = (StatContext.productReports || []).filter(
        (report) => {
            const regex = new RegExp(escapeRegExp(StatContext.search), 'igm')
            return [
                report.product.name,
                report.avePur,
                report.aveSales,
                report.purQty,
                report.salesQty,
                report.stock,
                report.totalPur,
                report.totalSales,
            ].some((item) => regex.test(`${item}`))
        }
    )

    useLayoutEffect(() => {
        StatContext.listProductReports()
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
                            const report = row as ProductReport
                            return (
                                <div className="hover:text-teal-600 cursor-pointer">
                                    <Link href={`/inventory/${report.id}`}>
                                        {report.product.name}
                                    </Link>
                                </div>
                            )
                        },
                        sort: (report) => report.product.name,
                    },
                    {
                        title: 'Stock',
                        format: (row) => {
                            const report = row as ProductReport
                            return report.stock
                        },
                        sort: (report) => report.stock,
                    },
                    {
                        title: 'Sales Qty',
                        format: (row) => {
                            const report = row as ProductReport
                            return report.salesQty
                        },
                        sort: (report) => report.salesQty,
                    },
                    {
                        title: 'Pur Qty',
                        format: (row) => {
                            const report = row as ProductReport
                            return report.purQty
                        },
                        sort: (report) => report.purQty,
                    },
                    {
                        title: 'Ave Sale',
                        format: (row) => {
                            const report = row as ProductReport
                            return formatCurrency(report.aveSales)
                        },
                        sort: (report) => report.aveSales,
                    },
                    {
                        title: 'Ave Pur',
                        format: (row) => {
                            const report = row as ProductReport
                            return formatCurrency(report.avePur)
                        },
                        sort: (report) => report.avePur,
                    },
                    {
                        title: 'Total Sales',
                        format: (row) => {
                            const report = row as ProductReport
                            return formatCurrency(report.totalSales)
                        },
                        sort: (report) => report.totalSales,
                    },
                    {
                        title: 'Total Pur',
                        format: (row) => {
                            const report = row as ProductReport
                            return formatCurrency(report.totalPur)
                        },
                        sort: (report) => report.totalPur,
                    },
                ]}
            />
        </Card>
    )
}

export default ReportingTable
