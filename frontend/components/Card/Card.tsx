import { FC } from 'react'
import clsx from 'clsx'
import styled from 'styled-components'

type Props = {
    title?: string
    children: JSX.Element
    cardClsx?: string
    titleClsx?: string
    bodyClsx?: string
}

const CardContainer = styled.div`
    border-radius: 0.25rem;
    background-color: #fff;
    border-width: 1px;
    border-color: #e2e8f0;
`

const Card: FC<Props> = (props) => (
    <CardContainer className={props.cardClsx}>
        {props.title && (
            <div
                className={clsx(
                    'px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left',
                    'text-gray-500 uppercase border-b border-gray-200',
                    props.titleClsx
                )}
            >
                {props.title}
            </div>
        )}
        <div className={clsx('px-6 py-3', props.bodyClsx)}>
            {props.children}
        </div>
    </CardContainer>
)

export default Card
