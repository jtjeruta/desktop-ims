import { FC, useLayoutEffect, useState, KeyboardEvent } from 'react'
import clsx from 'clsx'
import { useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import TextField, { Props as TextFieldProps } from '../TextField/TextField'

type Option = { text: string; value: string | number }
type Props = TextFieldProps & {
    options: Option[]
    onSelectOption?: (option: string | number) => void
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
            background-color: #fff;
            border: 1px solid rgb(37, 99, 235);
            border-radius: 0.25rem;
        }
    }
`

const AutoCompleteField: FC<Props> = (props) => {
    const methods = useFormContext()
    const [search, setSearch] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false)
    const [focused, setFocused] = useState<boolean>(false)
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)

    const filteredOptions = props.options.filter(
        (option, index) =>
            option.text.includes(search) &&
            option.text !== search &&
            option.text.trim() !== '' &&
            index < 5
    )

    // set on change
    useLayoutEffect(() => {
        const subscription = methods.watch((data, { name }) => {
            if (name !== props.name || !focused) return
            setSearch(data[name] ?? '')
            setOpen(data[name] && data[name].trim() !== '')
        })
        return () => subscription.unsubscribe()
    }, [focused])

    const handleSelectOption = (option: Option) => {
        methods.setValue(props.name, option.text)
        props.onSelectOption?.(option.value)
        setOpen(false)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (filteredOptions.length <= 0) return
        if (e.key === 'ArrowDown') {
            if (!open) {
                setOpen(true)
                setSelectedIndex(-1)
            }

            setSelectedIndex((prev) =>
                prev >= filteredOptions.length - 1 ? 0 : prev + 1
            )
        } else if (e.key === 'ArrowUp' && open) {
            setSelectedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1
            )
        } else if (e.key === 'Enter' && open) {
            e.preventDefault()
            const option = filteredOptions.find(
                (_, index) => index === selectedIndex
            )
            if (!option) return
            handleSelectOption(option)
        }
    }

    return (
        <Wrapper
            onFocus={() => setFocused(true)}
            onBlur={() => {
                setOpen(false)
                setFocused(false)
            }}
            onKeyDown={handleKeyDown}
        >
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
                                        index > 0 && 'border-t',
                                        selectedIndex === index && 'bg-gray-100'
                                    )}
                                    onClick={() => handleSelectOption(option)}
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

export default AutoCompleteField
