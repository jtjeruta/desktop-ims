import { FC } from 'react'
import { IconType } from 'react-icons/lib'
import styled from 'styled-components'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { formatCurrency } from '../../uitls'

const ReportCard = styled.div`
    flex-grow: 1;
    box-sizing: border-box;
    border-width: 0px;
    border-style: solid;
    border-color: #e2e8f0;

    &:hover {
        .card {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border-color: #fff;
            transform: scale(1.01);
        }

        .footer {
            padding: 0;
            border-width: 0;
        }
    }

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

    .footer {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
    }
`

export type SingleStatCounterType = {
    title: string
    total: number
    loading: string
    icon: IconType
    iconClass: string
}

const SingleStatCounter: FC<SingleStatCounterType> = (props) => {
    const Appcontext = useAppContext()
    return (
        <ReportCard>
            <div className="card">
                <div className="card-body">
                    <div className="flex flex-row justify-between items-center">
                        <div>
                            {Appcontext.isLoading(props.loading) ? (
                                <div
                                    className="bg-slate-200 animate-pulse mb-2"
                                    style={{ height: '1.75rem' }}
                                />
                            ) : (
                                <h1 className="total">
                                    {formatCurrency(props.total)}
                                </h1>
                            )}
                            <p className="title">{props.title}</p>
                        </div>
                        <props.icon className={props.iconClass} fontSize={38} />
                    </div>
                </div>
            </div>
            <div className="footer bg-white p-1 mx-4 border border-t-0 rounded rounded-t-none"></div>
        </ReportCard>
    )
}

export default SingleStatCounter
