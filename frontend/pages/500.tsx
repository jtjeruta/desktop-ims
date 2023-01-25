import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

const ErrorPage: NextPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-9xl font-bold">500</h1>
            <h2 className="text-2xl font-bold">Internal Server Error</h2>
            <Link href="/">
                <a className="text-blue-500">Go back to home</a>
            </Link>
        </div>
    )
}

export default ErrorPage
