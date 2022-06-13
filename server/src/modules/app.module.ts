import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UsersModule } from './users.module'

const MONGO_CONNECTION_STRING =
    process.env.MONGO_CONNECTION_STRING || 'mongodb://desktop-ims-db:27017/ims'

@Module({
    imports: [MongooseModule.forRoot(MONGO_CONNECTION_STRING), UsersModule],
})
export class AppModule {}
