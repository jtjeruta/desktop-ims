import clsx from 'clsx'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

type Props = {
    error?: boolean
    helperText?: string
    label: string
    placeholder?: string
    required?: boolean
    name: string
    options: { text?: string; value: string | number }[]
    className?: string
    disabled?: boolean
}

const Select: FC<Props> = (props) => {
    const methods = useFormContext()
    const register = methods
        ? methods.register(
              props.name,
              props.required ? { required: props.required } : {}
          )
        : {}
    const errorMessage: string | undefined =
        methods?.formState.errors[props.name]?.message

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
            <select
                className={clsx(
                    'form-control block w-full pl-1 pr-4 py-2.5 text-sm font-normal',
                    'text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300',
                    'rounded transition ease-in-out m-0',
                    'focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none',
                    errorMessage && 'border-red-300'
                )}
                required={props.required}
                disabled={props.disabled}
                {...register}
            >
                {!props.required && (
                    <option value="">{props.placeholder}</option>
                )}
                {props.options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.text || option.value}
                    </option>
                ))}
            </select>
            {!errorMessage ? (
                props.helperText ? (
                    <small>{props.helperText}</small>
                ) : (
                    <small className="invisible">no text</small>
                )
            ) : (
                <small className="text-red-500">{errorMessage}</small>
            )}
        </div>
    )
}

export default Select
