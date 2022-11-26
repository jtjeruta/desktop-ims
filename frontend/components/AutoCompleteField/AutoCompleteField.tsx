import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import TextField, { Props as TextFieldProps } from '../TextField/TextField'

type Option = { text: string; value: string | number }
type Props = TextFieldProps & {
    options: Option[]
    onClick?: (option: string | number) => void
}

const Wrapper = styled.div`
    position: relative;

    .popup-wrapper {
        position: absolute;
        top: 68px;
        width: 100%;
        height: 0px;
        z-index: 20;
        transition: height 1000ms;
        overflow: hidden;

        &.open {
            height: fit-content;
        }

        .popup-card {
            min-height: 3rem;
            background-color: #fff;
            border: 1px solid rgb(37, 99, 235);
            border-radius: 0.25rem;
        }
    }
`

const AutoCompleteWrapper: FC<Props> = (props) => {
    const methods = useFormContext()
    const [search, setSearch] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false)

    const filteredOptions = props.options.filter(
        (option) => option.text.includes(search) && option.text.trim() !== ''
    )

    // set on change
    useEffect(() => {
        const subscription = methods.watch((data, { name }) => {
            if (name === props.name && data[name] && data[name].trim() !== '') {
                setSearch(data[name])
                setOpen(true)
            } else {
                setOpen(false)
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    const handleClick = (option: Option) => () => {
        methods.setValue(props.name, option.text)
        props.onClick?.(option.value)
        setOpen(false)
    }

    return (
        <Wrapper onBlur={() => setOpen(false)}>
            <TextField {...props} autoComplete={false} />
            <div
                className={clsx(
                    'popup-wrapper',
                    open && filteredOptions.length > 0 ? 'open' : ''
                )}
            >
                <div className="popup-card">
                    <ul className="w-full text-gray-900">
                        {filteredOptions.map((option, index) => {
                            return (
                                <li
                                    key={option.value}
                                    className={clsx(
                                        'p-2 border-gray-200 w-full text-sm hover:bg-gray-100 cursor-pointer',
                                        index > 0 && 'border-t'
                                    )}
                                    onClick={handleClick(option)}
                                >
                                    {option.text}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </Wrapper>
    )
}

export default AutoCompleteWrapper
