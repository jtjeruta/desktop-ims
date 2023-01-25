import { FC, useState } from 'react'
import clsx from 'clsx'
import styled from 'styled-components'
import Button from '../Button/Button'
import { FaCog } from 'react-icons/fa'

type Props = {
    children: React.ReactNode
}

const Wrapper = styled.div`
    position: relative;
    display: flex;

    .popup-wrapper {
        position: absolute;
        top: 45px;
        right: 0px;
        width: fit-content;
        height: 0px;
        z-index: 20;
        transition: height 1000ms;
        overflow: hidden;

        &.open {
            height: fit-content;
        }
    }
`

const Dropdown: FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Wrapper>
            <Button color="secondary" onClick={() => setOpen((prev) => !prev)}>
                <FaCog />
            </Button>
            <div className={clsx('popup-wrapper', open && 'open')}>
                <div className="bg-white border rounded p-3">
                    {props.children}
                </div>
            </div>
        </Wrapper>
    )
}

export default Dropdown
