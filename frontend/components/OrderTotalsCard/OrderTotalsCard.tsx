import { FC } from 'react'
import Card from '../Card/Card'
import { formatCurrency } from '../../uitls'
import Button from '../Button/Button'

type Props = {
    total: number
    disabled?: boolean
    loading?: boolean
    onSubmit: () => void
    buttonText: string
}

const OrderTotalsCard: FC<Props> = (props) => {
    return (
        <Card cardClsx="w-full md:w-1/3 h-full" bodyClsx="h-full">
            <div className="flex flex-col justify-center h-full">
                <div className="flex justify-between text-2xl mb-5">
                    <b>TOTAL:</b>
                    <b>{formatCurrency(props.total)}</b>
                </div>
                <Button
                    className="text-2xl w-full"
                    disabled={props.disabled}
                    loading={props.loading}
                    onClick={props.onSubmit}
                >
                    {props.buttonText}
                </Button>
            </div>
        </Card>
    )
}

export default OrderTotalsCard
