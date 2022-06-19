import { FC } from 'react'

type Props = {
    children: string | JSX.Element
    type?: 'primary' | 'link'
}

const Button: FC<Props> = (props) => {
    const classes = {
        primary:
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
        link: 'font-medium text-blue-600 dark:text-blue-500 hover:underline',
    }

    const btnClass = classes[props.type || 'primary']

    return <button className={btnClass}>{props.children}</button>
}

export default Button
