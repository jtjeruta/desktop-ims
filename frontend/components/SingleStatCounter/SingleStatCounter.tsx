import clsx from 'clsx'
import { FC } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'
import styled from 'styled-components'

const ReportCard = styled.div`
    flex-grow: 1;
    box-sizing: border-box;
    border-width: 0px;
    border-style: solid;
    border-color: #e2e8f0;

    .card {
        transition: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
        border-radius: 0.25rem;
        background-color: #fff;
        border-width: 1px;
        border-color: #e2e8f0;
    }

    .card-body {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
    }

    .badge {
        padding: 2px 0;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }

    .total {
        font-size: 1.5rem;
        font-weight: 800;
    }

    .title {
        letter-spacing: 0.05em;
        font-size: 0.875rem;
        color: #a0aec0;
        color: rgba(160, 174, 192, 1);
    }
`

export type SingleStatCounterType = {
    title: string
    total: number
    rate: number
    icon: IconType
    iconClass: string
}

const SingleStatCounter: FC<SingleStatCounterType> = (props) => {
    return (
        <ReportCard>
            <div className="card">
                <div className="card-body">
                    <div className="flex flex-row justify-between items-center">
                        <props.icon className={props.iconClass} fontSize={24} />
                        <span
                            className={clsx(
                                'rounded-full text-white badge bg-red-400 text-xs flex items-center gap-1',
                                props.rate <= 0 ? 'bg-red-400' : 'bg-teal-400'
                            )}
                        >
                            <span>{Math.abs(props.rate)}%</span>
                            {props.rate <= 0 ? (
                                <FaChevronDown />
                            ) : (
                                <FaChevronUp />
                            )}
                        </span>
                    </div>

                    <div className="mt-8">
                        <h1 className="total">{props.total}</h1>
                        <p className="title">{props.title}</p>
                    </div>
                </div>
            </div>
            <div className="footer bg-white p-1 mx-4 border border-t-0 rounded rounded-t-none"></div>
        </ReportCard>
    )
}

export default SingleStatCounter
