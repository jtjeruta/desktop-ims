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
    {
        pathname: '/vendors',
        access: 'admin',
    },
    {
        pathname: '/vendors/[vendorId]',
        access: 'admin',
    },
    {
        pathname: '/sales-orders',
        access: 'admin',
    },
    {
        pathname: '/sales-orders/[orderId]',
        access: 'everyone',
    },
    {
        pathname: '/customers/[customerId]',
        access: 'admin',
    },
    {
        pathname: '/dashboard',
        access: 'admin',
    },
]
