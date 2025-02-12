import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../users/guards/roles.guard';
import { AuthGuard } from '../auth/guards/AuthGuard';

@ApiTags('Estadísticas')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Empleado)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return this.statisticsService.findAll();
  }
}
