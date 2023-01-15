import Button from '../Button/Button'
import Card from '../Card/Card'
import TextField from '../TextField/TextField'

const OrderSummarySkeleton = () => {
    return (
        <Card cardClsx="w-full md:w-1/3 h-full" bodyClsx="h-full">
            <div className="flex flex-col justify-center h-full">
                <TextField
                    name="date"
                    label="Order Date"
                    type="date"
                    disabled
                />
                <TextField name="invoiceNumber" label="Invoice #" disabled />
                <div className="flex justify-between text-2xl mb-5">
                    <b>TOTAL:</b>
                    <b></b>
                </div>
                <Button className="text-2xl w-full h-12" disabled />
            </div>
        </Card>
    )
}

export default OrderSummarySkeleton
