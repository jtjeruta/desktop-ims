import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { hash } from 'bcrypt'
import { User, UserDocument } from '../schemas/user.schema'
import { CreateUserDto } from '../dto/create-user.dto'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async create({
        password,
        ...userDetails
    }: CreateUserDto): Promise<UserDocument> {
        const encryptedPassword = await hash(password, 10)

        const createdUser = new this.userModel({
            ...userDetails,
            password: encryptedPassword,
        })

        return createdUser.save()
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().exec()
    }

    async remove(id: string): Promise<void> {
        await this.userModel.deleteOne({ _id: id })
    }
}
