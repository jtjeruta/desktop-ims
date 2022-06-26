import clsx from 'clsx'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

type Props = {
    defaultValue?: string | number
    error?: boolean
    helperText?: string
    label: string
    placeholder?: string
    required?: boolean
    name: string
    options: { text?: string; value: string }[]
}

const Select: FC<Props> = (props) => {
    const methods = useFormContext()
    const register = methods
        ? methods.register(props.name, { required: props.required })
        : {}
    const errorMessage: string | undefined =
        methods?.formState.errors[props.name]?.message

    return (
        <div className="relative">
            {props.label && (
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {props.required ? (
                        <span className="text-red-700">* </span>
                    ) : null}
                    {props.label}
                </label>
            )}
            <select
                value={props.defaultValue}
                className={clsx(
                    'form-control block w-full px-4 py-2 text-xl font-normal',
                    'text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300',
                    'rounded transition ease-in-out m-0',
                    'focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none',
                    errorMessage && 'border-red-300'
                )}
                placeholder={props.placeholder}
                required={props.required}
                {...register}
            >
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