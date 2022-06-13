import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common'
import { MongoError } from 'mongodb'

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost) {
        console.error(`Mongo Error: ${exception.code} - ${exception.message}`)
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()

        const error = { message: '' }
        let status

        switch (exception.code) {
            case 11000:
                status = HttpStatus.CONFLICT
                error.message = 'Duplicate resource'
                break
            default:
                status = HttpStatus.INTERNAL_SERVER_ERROR
                error.message = 'Something went wrong'
        }

        return response.status(status).json(error)
    }
}
