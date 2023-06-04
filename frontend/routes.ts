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
        access: 'authenticated',
    },
    {
        pathname: '/sales-orders/[orderId]',
        access: 'authenticated',
    },
    {
        pathname: '/reporting',
        access: 'admin',
    },
    {
        pathname: '/warehouses',
        access: 'admin',
    },
    {
        pathname: '/expenses',
        access: 'admin',
    },
    {
        pathname: '/receivables',
        access: 'admin',
    },
    {
        pathname: '/connect',
        access: 'authenticated',
    },
    {
        pathname: '/500',
        access: 'everyone',
    },
    {
        pathname: '/404',
        access: 'everyone',
    },
]
