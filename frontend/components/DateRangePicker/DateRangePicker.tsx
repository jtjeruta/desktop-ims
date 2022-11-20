import { FC, useEffect, useState } from 'react'
import clsx from 'clsx'
import moment, { Moment } from 'moment'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { FaArrowRight, FaCalendar } from 'react-icons/fa'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import styled from 'styled-components'
import Button from '../Button/Button'
import Dialog from '../Dialog/Dialog'

const Root = styled.div`
    max-width: min-content;
    overflow: hidden;

    .react-datepicker-wrapper {
        width: 82px;

        input {
            width: 100%;

            &:focus-visible {
                outline: none;
            }
        }
    }
`
const ranges = {
    Today: {
        start: moment().startOf('day'),
        end: moment().endOf('day'),
    },
    Yesterday: {
        start: moment().subtract(1, 'day').startOf('day'),
        end: moment().subtract(1, 'day').endOf('day'),
    },
    'Last 7 Days': {
        start: moment().subtract(6, 'day').startOf('day'),
        end: moment().endOf('day'),
    },
    'Last 30 Days': {
        start: moment().subtract(29, 'day').startOf('day'),
        end: moment().endOf('day'),
    },
    'Last 60 Days': {
        start: moment().subtract(59, 'day').startOf('day'),
        end: moment().endOf('day'),
    },
    'This Month': {
        start: moment().startOf('month'),
        end: moment().endOf('day'),
    },
    'Last Month': {
        start: moment().subtract(1, 'month').startOf('month'),
        end: moment().subtract(1, 'month').endOf('month'),
    },
    'Last 2 Months': {
        start: moment().subtract(2, 'month').startOf('month'),
        end: moment().subtract(1, 'month').endOf('month'),
    },
    'This year': {
        start: moment().startOf('year'),
        end: moment().subtract(1, 'month').endOf('month'),
    },
}

type RangeKey = keyof typeof ranges
type Props = {
    defaultStartDate: number
    defaultEndDate: number
    onChange: (startDate: number, endDate: number) => void
}

const DateRangePicker: FC<Props> = (props) => {
    const AppContext = useAppContext()
    const [startDate, setStartDate] = useState<Moment>(
        moment(props.defaultStartDate * 1000)
    )
    const [endDate, setEndDate] = useState<Moment>(
        moment(props.defaultEndDate * 1000)
    )
    const handleOnChange = (target: 'start' | 'end') => (date: Date) => {
        target === 'start' && setStartDate(moment(date).startOf('day'))
        target === 'end' && setEndDate(moment(date).endOf('day'))
    }
    const handleRangeSelect = (key: RangeKey) => () => {
        setStartDate(ranges[key].start)
        setEndDate(ranges[key].end)
        AppContext.closeDialog()
    }

    useEffect(() => {
        props.onChange(startDate.unix(), endDate.unix())
    }, [startDate, endDate])

    return (
        <>
            <Root
                className={clsx(
                    'form-control block w-full pl-2 py-2 text-sm font-normal rounded',
                    'text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300',
                    'flex items-center gap-3'
                )}
            >
                <DatePicker
                    maxDate={endDate.toDate()}
                    selected={startDate.toDate()}
                    onChange={handleOnChange('start')}
                    dateFormat="MMM dd, yyyy"
                />
                <FaArrowRight />
                <DatePicker
                    minDate={startDate.toDate()}
                    selected={endDate.toDate()}
                    onChange={handleOnChange('end')}
                    dateFormat="MMM dd, yyyy"
                />
                <Button
                    style="link"
                    color="secondary"
                    onClick={() =>
                        AppContext.openDialog('date-range-picker-dialog')
                    }
                >
                    <FaCalendar />
                </Button>
            </Root>

            <Dialog
                title="Select Range"
                open={AppContext.dialogIsOpen('date-range-picker-dialog')}
                content={
                    <div className="flex flex-col gap-3">
                        {(
                            Object.keys(ranges) as Array<keyof typeof ranges>
                        ).map((key) => (
                            <Button
                                className="text-sm"
                                style="outline"
                                color="secondary"
                                key={key}
                                onClick={handleRangeSelect(key)}
                                disabled={
                                    startDate.isSame(
                                        ranges[key].start,
                                        'day'
                                    ) && endDate.isSame(ranges[key].end, 'day')
                                }
                            >
                                {key}
                            </Button>
                        ))}
                    </div>
                }
                showCancelButton={false}
                showSaveButton={false}
                className="md:w-1/4"
            />
        </>
    )
}

export default DateRangePicker
