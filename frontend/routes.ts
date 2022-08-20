export type Route = {
    pathname: string
    access:
        | 'everyone'
        | 'authenticated'
        | 'admin'
        | 'employee'
        | 'un-authenticated'
    parents?: string[]
}

export const routes: Route[] = [
    {
        pathname: '/',
        access: 'everyone',
    },
    {
        pathname: '/login',
        access: 'un-authenticated',
    },
    {
        pathname: '/users',
        access: 'admin',
    },
    {
        pathname: '/inventory',
        access: 'admin',
    },
    {
        pathname: '/inventory/[productId]',
        access: 'admin',
    },
    {
        pathname: '/purchase-orders',
        access: 'admin',
    },
    {
        pathname: '/purchase-orders/[orderId]',
        access: 'admin',
    },
]
