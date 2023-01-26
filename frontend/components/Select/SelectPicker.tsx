import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import Select, { ActionMeta, PropsValue, SingleValue } from 'react-select'

type Props = {
    error?: boolean
    helperText?: string
    label: string
    placeholder?: string
    required?: boolean
    name: string
    options: { label: string; value: string | number }[]
    className?: string
    disabled?: boolean
    defaultValue?: PropsValue<{ label: string; value: string | number }>
    onChange?: (
        newValue: SingleValue<{ label: string; value: string | number }>,
        actionMeta: ActionMeta<{ label: string; value: string | number }>
    ) => void
}

const SelectPicker: FC<Props> = (props) => {
    const [body, setBody] = useState<HTMLElement | null>(null)

    useEffect(() => {
        setBody(document.body)
    }, [])

    return (
        <div
            className={clsx(
                'relative',
                props.disabled && 'opacity-60',
                props.className
            )}
        >
            {props.label && (
                <label className="block mb-2 text-sm font-medium text-gray-900">
                    {props.required ? (
                        <span className="text-red-700">* </span>
                    ) : null}
                    {props.label}
                </label>
            )}
            <Select
                defaultValue={props.defaultValue}
                required={props.required}
                isDisabled={props.disabled}
                options={props.options}
                onChange={props.onChange}
                className={clsx(props.error && 'border-red-500 border rounded')}
                menuPortalTarget={body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
            {props.error ? (
                <small className="text-red-500">{props.error}</small>
            ) : props.helperText ? (
                <small>{props.helperText}</small>
            ) : (
                <small className="invisible">no text</small>
            )}
        </div>
    )
}

export default SelectPicker
