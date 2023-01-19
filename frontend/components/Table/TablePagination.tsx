import clsx from 'clsx'
import { FC } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import ReactPaginate from 'react-paginate'
import styled from 'styled-components'
import { ITEMS_PER_TABLE } from '../../constants'

const Root = styled.div`
    ul {
        display: flex;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

        li {
            border: 1px solid rgb(209 213 219);
            background-color: #fff;
            font-size: 0.875rem;
            line-height: 1.25rem;
            color: rgb(107 114 128);
            display: flex;
            align-items: center;

            a {
                padding: 0.5rem 1rem;
            }

            &:first-child {
                border-radius: 0.25rem 0px 0px 0.25rem;
            }
            &:last-child {
                border-radius: 0px 0.25rem 0.25rem 0px;
            }
            &.disabled {
                background-color: rgb(241 245 249);
                cursor: not-allowed;
            }
            &.selected {
                color: rgb(13, 148, 136);
                border-color: rgb(13, 148, 136);
                background-color: rgb(240 253 250);
            }
        }
    }
`

type Props = {
    totalRecords: number
    page?: number
    handlePageChange: (page: number) => void
    className?: string
}

const TablePagination: FC<Props> = (props) => {
    const page = props.page ?? 0
    const minItems = page * ITEMS_PER_TABLE + 1
    const maxItems = Math.min((page + 1) * ITEMS_PER_TABLE, props.totalRecords)
    const pageCount = Math.ceil(props.totalRecords / ITEMS_PER_TABLE)

    return (
        <Root
            className={clsx(
                'hidden sm:flex sm:flex-1 sm:items-center sm:justify-between',
                props.className
            )}
        >
            <div>
                <p className="text-sm text-gray-700 flex gap-1">
                    <span>Showing</span>
                    <span className="font-medium">{minItems}</span>
                    <span>to</span>
                    <span className="font-medium">{maxItems}</span>
                    <span>of</span>
                    <span className="font-medium">{props.totalRecords}</span>
                    <span>results</span>
                </p>
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel={<FaChevronRight />}
                previousLabel={<FaChevronLeft />}
                onPageChange={({ selected }) =>
                    props.handlePageChange(selected)
                }
                pageRangeDisplayed={5}
                pageCount={pageCount}
                initialPage={page}
            />
        </Root>
    )
}

export default TablePagination
