import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { CreateUserDto } from '../dto/create-user.dto'
import { MongoUser } from 'src/types/mongo-user'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<MongoUser> {
        const createdUser = new this.userModel(createUserDto)
        return createdUser.save()
    }

    async findAll(): Promise<MongoUser[]> {
        return this.userModel.find().exec()
    }

    async remove(id: string): Promise<void> {
        await this.userModel.deleteOne({ _id: id })
    }
}
