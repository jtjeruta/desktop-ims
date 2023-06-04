import QRCode from 'react-qr-code'
import UserLayout from '../../components/UserLayout/UserLayout'
import Alert from '../../components/Alert/Alert'
import Card from '../../components/Card/Card'

const BACKEND_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000'

const APP_URL = BACKEND_URL.replace(':4000', ':3000')

const ConnectPage = () => {
    return (
        <UserLayout>
            <div className="flex flex-col items-center h-full gap-10">
                <Alert
                    type="info"
                    content="Scan the QR code to redirect to the app"
                />
                <div className="max-w-sm">
                    <Card bodyClsx="!p-3">
                        <QRCode
                            size={256}
                            style={{
                                height: 'auto',
                                maxWidth: '100%',
                                width: '100%',
                            }}
                            value={APP_URL}
                            viewBox={`0 0 256 256`}
                        />
                    </Card>
                </div>

                <p>
                    Or you can use this link:{' '}
                    <a className="text-blue-400" target="_blank" href={APP_URL}>
                        {APP_URL}
                    </a>
                </p>
            </div>
        </UserLayout>
    )
}

export default ConnectPage
