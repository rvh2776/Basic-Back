import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { RolesGuard } from '../users/guards/roles.guard';

@ApiTags('Mensajes')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messagesService.create(createMessageDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Empleado)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('estado') estado: string = '',
  ) {
    return this.messagesService.findAll(page, limit, search, estado);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Empleado)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messagesService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Empleado)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id/state')
  async updateState(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStateMessageDto: UpdateMessageDto,
  ) {
    return await this.messagesService.updateState(id, updateStateMessageDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Empleado)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return await this.messagesService.update(id, updateMessageDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messagesService.remove(id);
  }
}
