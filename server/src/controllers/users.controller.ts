import {
    Controller,
    Post,
    Get,
    Body,
    Delete,
    Param,
    UseFilters,
} from '@nestjs/common'
import { CreateUserDto } from 'src/dto/create-user.dto'
import { MongoExceptionFilter } from 'src/lib/mongo-exception'
import { getUsersView, getUserView } from 'src/views/user.view'
import { UsersService } from '../services/users.service'

@Controller()
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post('api/v1/users')
    @UseFilters(MongoExceptionFilter)
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.service.create(createUserDto)
        return getUserView(user)
    }

    @Get('api/v1/users')
    @UseFilters(MongoExceptionFilter)
    async list() {
        const users = await this.service.findAll()
        return getUsersView(users)
    }

    @Delete('api/v1/users/:id')
    @UseFilters(MongoExceptionFilter)
    async remove(@Param('id') id: string) {
        await this.service.remove(id)
        return null
    }
}
