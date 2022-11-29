import Link from 'next/link'
import { useEffect } from 'react'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useStatContext } from '../../contexts/StatsContext/StatsContext'
import { ProductReport } from '../../contexts/StatsContext/types'
import Card from '../Card/Card'
import Table from '../Table/Table'

const ReportingTable = () => {
    const AppContext = useAppContext()
    const StatContext = useStatContext()

    const filteredReports = (StatContext.productReports || []).filter(
        (report) => {
            const regex = new RegExp(StatContext.search, 'igm')
            return [
                report.product.name,
                report.variant.name,
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

    useEffect(() => {
        StatContext.listProductReports()
    }, [])

    return (
        <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
            <Table
                rows={filteredReports}
                loading={AppContext.isLoading('list-product-reports')}
                columns={[
                    {
                        title: 'Product',
                        format: (row) => {
                            const report = row as ProductReport
                            return (
                                <Link href={`/inventory/${report.product.id}`}>
                                    <span className="hover:text-teal-600 cursor-pointer">
                                        {report.product.name}
                                    </span>
                                </Link>
                            )
                        },
                        sort: (report) => report.product.name,
                    },
                    {
                        title: 'Unit',
                        format: (row) => {
                            const report = row as ProductReport
                            return (
                                <Link href={`/inventory/${report.product.id}`}>
                                    <span className="hover:text-teal-600 cursor-pointer">
                                        {report.variant.name}
                                    </span>
                                </Link>
                            )
                        },
                        sort: (report) => report.variant.name,
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
                            return report.aveSales
                        },
                        sort: (report) => report.aveSales,
                    },
                    {
                        title: 'Ave Pur',
                        format: (row) => {
                            const report = row as ProductReport
                            return report.avePur
                        },
                        sort: (report) => report.avePur,
                    },
                    {
                        title: 'Total Sales',
                        format: (row) => {
                            const report = row as ProductReport
                            return report.totalSales
                        },
                        sort: (report) => report.totalSales,
                    },
                    {
                        title: 'Total Pur',
                        format: (row) => {
                            const report = row as ProductReport
                            return report.totalPur
                        },
                        sort: (report) => report.totalPur,
                    },
                ]}
            />
        </Card>
    )
}

export default ReportingTable
