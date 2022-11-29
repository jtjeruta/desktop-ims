import clsx from 'clsx'
import { FC, FormEventHandler } from 'react'
import { FaSearch } from 'react-icons/fa'

type Props = {
    onSearch: (value: string) => void
    placeholder?: string
    inputClass?: string
}

let timeout: NodeJS.Timeout

const SearchBar: FC<Props> = (props) => {
    const onSearch: FormEventHandler<HTMLInputElement> = (e) => {
        const value = e.currentTarget.value
        timeout && clearTimeout(timeout)
        timeout = setTimeout(() => props.onSearch(value), 300)
    }

    return (
        <div className="relative w-full md:w-fit">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400 text-md" />
            </div>
            <input
                type="text"
                id="voice-search"
                className={clsx(
                    'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-1 outline-none',
                    props.inputClass
                )}
                placeholder={props.placeholder || 'Search...'}
                onInput={onSearch}
            />
        </div>
    )
}

export default SearchBar
