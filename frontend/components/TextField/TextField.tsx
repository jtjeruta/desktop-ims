import { FC } from 'react'
import clsx from 'clsx'
import { useFormContext } from 'react-hook-form'

export type Props = {
    error?: boolean
    helperText?: string
    disableHelperText?: boolean
    label?: string
    placeholder?: string
    required?: boolean
    type?: 'text' | 'number' | 'password' | 'tel' | 'date'
    name: string
    autoFocus?: boolean
    min?: number
    max?: number
    className?: string
    autoComplete?: boolean
    disabled?: boolean
    step?: string
}

const TextField: FC<Props> = (props) => {
    const methods = useFormContext()
    const register = methods
        ? methods.register(props.name, { required: props.required })
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
            <input
                type={props.type || 'text'}
                className={clsx(
                    'form-control block w-full pl-2 pr-4 py-2 text-sm font-normal',
                    'text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300',
                    'rounded transition ease-in-out m-0',
                    'focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none',
                    errorMessage && 'border-red-300'
                )}
                placeholder={props.placeholder}
                required={props.required}
                autoFocus={props.autoFocus}
                min={props.min}
                max={props.max}
                autoComplete={props.autoComplete !== false ? 'on' : 'off'}
                data-lpignore="true"
                disabled={props.disabled}
                step={props.step}
                {...register}
            />
            {!props.disableHelperText && (
                <>
                    {!errorMessage ? (
                        props.helperText ? (
                            <small>{props.helperText}</small>
                        ) : (
                            <small className="invisible">no text</small>
                        )
                    ) : (
                        <small className="text-red-500">{errorMessage}</small>
                    )}
                </>
            )}
        </div>
    )
}

export default TextField
