import React from 'react'

interface Props {
    className?: string;
}

const Container: React.FC<React.PropsWithChildren<Props>> =({ children, className }: React.PropsWithChildren<Props>) => {
    return (
        <div className={`px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto ${className ? className : ""}`}>{children}</div>
    )
}

export default Container