import { FC } from 'react'
import Button from '../Button/Button'

type Props = {
    title: string
    buttons?: {
        text: string
        loading?: boolean
        onClick?: () => void
    }[]
}

const PageHeader: FC<Props> = (props) => {
    return (
        <div className="flex justify-between mb-3">
            <h3 className="text-3xl font-medium text-gray-700">
                {props.title}
            </h3>
            <div>
                {props.buttons &&
                    props.buttons.map((button) => (
                        <Button key={button.text}>{button.text}</Button>
                    ))}
            </div>
        </div>
    )
}

export default PageHeader
