import { useState } from 'react'
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
    'This Month': {
        start: moment().startOf('month'),
        end: moment().endOf('day'),
    },
    'Last Month': {
        start: moment().subtract(1, 'month').startOf('month'),
        end: moment().subtract(1, 'month').endOf('month'),
    },
}

const DateRangePicker = () => {
    const AppContext = useAppContext()
    const [startDate, setStartDate] = useState<Moment>(
        ranges['This Month'].start
    )
    const [endDate, setEndDate] = useState<Moment>(ranges['This Month'].end)

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
                    onChange={(date) =>
                        setStartDate(moment(date).startOf('day'))
                    }
                    dateFormat="MMM dd, yyyy"
                />
                <FaArrowRight />
                <DatePicker
                    minDate={startDate.toDate()}
                    selected={endDate.toDate()}
                    onChange={(date) => setEndDate(moment(date).endOf('day'))}
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
                                onClick={() => {
                                    setStartDate(ranges[key].start)
                                    setEndDate(ranges[key].end)
                                    AppContext.closeDialog()
                                }}
                                disabled={
                                    startDate.isSame(ranges[key].start) &&
                                    endDate.isSame(ranges[key].end)
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
