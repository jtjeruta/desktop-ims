import { FC } from 'react'
import clsx from 'clsx'
import { FaChevronRight, FaPlus } from 'react-icons/fa'
import Button from '../Button/Button'
import SearchBar from '../SearchBar/SearchBar'
import Switch from '../Switch/Switch'
import { useRouter } from 'next/router'

type Props = {
    breadcrumbs: { text: string; url?: string }[]
    buttons?: {
        text: string
        loading?: boolean
        onClick?: () => void
    }[]
    switches?: {
        toggledText: string
        unToggledText: string
        toggled: boolean
        loading?: boolean
        onClick?: () => void
    }[]
    searchbar?: {
        onSearch: (value: string) => void
    }
    headerClsx?: string
}

const PageHeader: FC<Props> = (props) => {
    const router = useRouter()

    return (
        <>
            <div
                className={clsx(
                    'flex justify-between mb-3 gap-4 flex-col md:flex-row',
                    props.headerClsx
                )}
            >
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        {props.breadcrumbs.map((breadcrumb, index) => (
                            <li
                                className="inline-flex items-center"
                                key={breadcrumb.text ?? index}
                            >
                                <a
                                    onClick={() =>
                                        breadcrumb.url &&
                                        router.push(breadcrumb.url)
                                    }
                                    className={clsx(
                                        'inline-flex items-center text-md font-medium dark:text-gray-400',
                                        breadcrumb.url
                                            ? 'cursor-pointer hover:text-gray-900 dark:hover:text-white text-gray-700'
                                            : 'cursor-default text-gray-500'
                                    )}
                                >
                                    <>
                                        {index > 0 && (
                                            <FaChevronRight className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-2" />
                                        )}
                                        {breadcrumb.text}
                                    </>
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>
                <div className="flex items:start md:items-center gap-4 flex-col md:flex-row">
                    {props.searchbar && (
                        <SearchBar onSearch={props.searchbar.onSearch} />
                    )}
                    <div className="hidden md:block">
                        {props.buttons &&
                            props.buttons.map((button) => (
                                <Button
                                    key={button.text}
                                    onClick={button.onClick}
                                    className="min-w-max !py-1 !text-sm"
                                >
                                    {button.text}
                                </Button>
                            ))}
                    </div>
                    {props.switches &&
                        props.switches.map((button) => (
                            <Switch
                                key={button.toggledText}
                                toggled={button.toggled}
                                toggledText={button.toggledText}
                                unToggledText={button.unToggledText}
                                loading={button.loading}
                                onClick={button.onClick}
                                textPosition="left"
                            />
                        ))}
                </div>
            </div>
            {props.buttons && (
                <button
                    className={clsx(
                        'fixed z-90 bottom-10 right-4 bg-blue-500 w-16 h-16 rounded-full drop-shadow-lg',
                        'flex justify-center items-center text-white text-4xl md:hidden'
                    )}
                    onClick={() => {
                        if (!props.buttons || props.buttons.length <= 0) return
                        if (props.buttons.length === 1) {
                            props.buttons[0].onClick?.()
                        }
                    }}
                >
                    <FaPlus />
                </button>
            )}
        </>
    )
}

export default PageHeader
