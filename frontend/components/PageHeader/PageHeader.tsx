import { FC } from 'react'
import Button from '../Button/Button'
import Switch from '../Switch/Switch'

type Props = {
    title: string | JSX.Element
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
}

const PageHeader: FC<Props> = (props) => {
    return (
        <div className="flex justify-between mb-3">
            <h3 className="text-3xl font-medium text-gray-700">
                {props.title}
            </h3>
            <div className="flex items-center">
                {props.buttons &&
                    props.buttons.map((button) => (
                        <Button key={button.text} onClick={button.onClick}>
                            {button.text}
                        </Button>
                    ))}
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
    )
}

export default PageHeader
