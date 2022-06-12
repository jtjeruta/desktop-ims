import React, { FC, useState } from 'react'
import { FaLock, FaUser } from 'react-icons/fa'
import styled from 'styled-components'
import clsx from 'clsx'

const RootContainer = styled.div`
    .icon {
        color: #d9d9d9;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    & > div {
        position: relative;
        height: 45px;
    }

    & > div > h5 {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #999;
        font-size: 18px;
        transition: 0.3s;
    }

    &:before,
    &:after {
        content: '';
        position: absolute;
        bottom: -2px;
        width: 0%;
        height: 2px;
        background-color: #38d39f;
        transition: 0.4s;
    }

    &:before {
        right: 50%;
    }

    &:after {
        left: 50%;
    }

    &.focus:before,
    &.focus:after {
        width: 50%;
    }

    &.focus > div > h5 {
        top: -5px;
        font-size: 15px;
    }

    &.has-content > div > h5 {
        top: -5px;
        font-size: 15px;
    }

    &.focus > .icon > svg {
        color: #38d39f;
    }
`

type Props = {
    type?: 'email' | 'password'
}

const Input: FC<Props> = ({ type }) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasContent, setHasContent] = useState(false)

    const handleChange = (value: string) => {
        setHasContent(value.length > 0)
    }

    return (
        <RootContainer
            className={clsx([
                `border-b-2 relative grid my-5 py-1 focus:outline-none`,
                isFocused && 'focus',
                hasContent && 'has-content',
            ])}
            style={{ gridTemplateColumns: '7% 93%' }}
        >
            <div className="icon">
                {type === 'email' ? <FaUser /> : <FaLock />}
            </div>
            <div>
                <h5>{type === 'email' ? 'Email' : 'Password'}</h5>
                <input
                    type={type === 'email' ? 'text' : 'password'}
                    className="absolute w-full h-full py-2 px-3 outline-none inset-0 text-gray-700"
                    style={{ background: 'none' }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>
        </RootContainer>
    )
}

export default Input
